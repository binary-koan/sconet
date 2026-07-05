require 'rails_helper'

describe "MCP endpoint" do
  let(:api_key) { create(:api_key) }
  let(:account) { create(:account, sort_order: 1) }
  let(:category) { create(:category, sort_order: 1) }

  def mcp_request(method, params = {}, token: api_key.token)
    post "/mcp",
         params: { jsonrpc: "2.0", id: 1, method:, params: }.to_json,
         headers: { "Content-Type" => "application/json", "Authorization" => "Bearer #{token}" }
    JSON.parse(response.body) if response.body.present?
  end

  it "requires authentication" do
    mcp_request("tools/list", token: "sconet_bogus")
    expect(response).to have_http_status(:unauthorized)
  end

  it "authenticates via token in the URL" do
    post "/mcp/#{api_key.token}",
         params: { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }.to_json,
         headers: { "Content-Type" => "application/json" }

    expect(JSON.parse(response.body).dig("result", "tools")).to be_present

    post "/mcp/sconet_bogus", params: { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }.to_json,
                              headers: { "Content-Type" => "application/json" }
    expect(response).to have_http_status(:unauthorized)
  end

  it "lists tools" do
    result = mcp_request("tools/list")

    tools = result.dig("result", "tools")
    expect(tools.map { |t| t["name"] }).to contain_exactly(
      "get_categories", "get_currencies", "get_accounts", "get_recent_transactions", "create_transaction"
    )
    expect(tools.find { |t| t["name"] == "get_accounts" }["annotations"]).to include("readOnlyHint" => true)
    expect(tools.find { |t| t["name"] == "create_transaction" }["annotations"]).to include("destructiveHint" => false)
  end

  it "fetches categories, currencies and accounts" do
    account
    category

    %w[get_categories get_currencies get_accounts].each do |tool|
      result = mcp_request("tools/call", { name: tool, arguments: {} })

      expect(result.dig("result", "isError")).to be_falsey
      expect(JSON.parse(result.dig("result", "content", 0, "text"))).not_to be_empty
    end
  end

  it "creates a transaction with a receipt image and lists it" do
    image = Base64.strict_encode64("fake-jpeg-bytes")

    result = mcp_request("tools/call", {
      name: "create_transaction",
      arguments: {
        account_id: account.id.to_s,
        category_id: category.id.to_s,
        date: Date.today.iso8601,
        shop: "Test Shop",
        amount_cents: -1250,
        memo: "Lunch",
        receipt_images: [{ data: image, filename: "receipt.jpg", content_type: "image/jpeg" }]
      }
    })

    expect(result.dig("result", "isError")).to be_falsey
    transaction = Transaction.find(JSON.parse(result.dig("result", "content", 0, "text"))["id"])
    expect(transaction).to have_attributes(shop: "Test Shop", amount_cents: -1250, account:, category:, currency: account.currency)
    expect(transaction.receipt_images.first.filename.to_s).to eq("receipt.jpg")

    recent = mcp_request("tools/call", { name: "get_recent_transactions", arguments: {} })
    expect(JSON.parse(recent.dig("result", "content", 0, "text")).first).to include("shop" => "Test Shop")
  end

  it "uploads a receipt image and attaches it by blob_signed_id" do
    post "/mcp/#{api_key.token}/uploads",
         params: { file: Rack::Test::UploadedFile.new(StringIO.new("fake-jpeg-bytes"), "image/jpeg", original_filename: "receipt.jpg") }
    expect(response).to have_http_status(:ok)
    signed_id = JSON.parse(response.body).fetch("blob_signed_id")

    result = mcp_request("tools/call", {
      name: "create_transaction",
      arguments: {
        account_id: account.id.to_s, date: Date.today.iso8601, shop: "Blob Shop", amount_cents: -500,
        receipt_images: [{ blob_signed_id: signed_id }]
      }
    })

    expect(result.dig("result", "isError")).to be_falsey
    transaction = Transaction.find(JSON.parse(result.dig("result", "content", 0, "text"))["id"])
    expect(transaction.receipt_images.first.filename.to_s).to eq("receipt.jpg")
  end

  it "crops an uploaded image, converting to JPEG regardless of source format" do
    png = Tempfile.new(%w[source .png])
    Vips::Image.black(100, 80).write_to_file(png.path)

    post "/mcp/#{api_key.token}/uploads",
         params: { file: Rack::Test::UploadedFile.new(png.path, "image/png") }
    signed_id = JSON.parse(response.body).fetch("blob_signed_id")

    result = mcp_request("tools/call", {
      name: "create_transaction",
      arguments: {
        account_id: account.id.to_s, date: Date.today.iso8601, shop: "Crop Shop", amount_cents: -100,
        receipt_images: [{ blob_signed_id: signed_id, crop: { x: 10, y: 20, width: 30, height: 40 } }]
      }
    })

    expect(result.dig("result", "isError")).to be_falsey
    transaction = Transaction.find(JSON.parse(result.dig("result", "content", 0, "text"))["id"])
    image = transaction.receipt_images.first
    expect(image.filename.to_s).to end_with(".jpg")
    expect(image.content_type).to eq("image/jpeg")
    cropped = Vips::Image.new_from_buffer(image.blob.download, "")
    expect([cropped.width, cropped.height]).to eq([30, 40])
  end

  it "rejects unauthenticated uploads" do
    post "/mcp/uploads", params: { file: Rack::Test::UploadedFile.new(StringIO.new("x"), "image/jpeg", original_filename: "x.jpg") }
    expect(response).to have_http_status(:unauthorized)
  end

  it "creates a foreign-currency transaction with splits" do
    czk = create(:currency, code: "CZK", name: "Czech Koruna", symbol: "Kč", decimal_digits: 2)

    result = mcp_request("tools/call", {
      name: "create_transaction",
      arguments: {
        account_id: account.id.to_s,
        date: Date.today.iso8601,
        shop: "Praha Potraviny",
        shop_amount_cents: -25000,
        shop_currency_id: czk.id.to_s,
        confirmed: false,
        splits: [
          { amount_cents: -15000, memo: "Bread", category_id: category.id.to_s },
          { amount_cents: -10000, memo: "Cheese", category_id: category.id.to_s }
        ]
      }
    })

    expect(result.dig("result", "isError")).to be_falsey
    transaction = Transaction.find(JSON.parse(result.dig("result", "content", 0, "text"))["id"])
    expect(transaction).to have_attributes(shop_amount_cents: -25000, shop_currency: czk, confirmed: false)
    expect(transaction.split_to.pluck(:memo, :shop_amount_cents, :category_id, :confirmed))
      .to contain_exactly(["Bread", -15000, category.id, false], ["Cheese", -10000, category.id, false])
  end

  it "rejects splits that do not sum to the total" do
    result = mcp_request("tools/call", {
      name: "create_transaction",
      arguments: {
        account_id: account.id.to_s, date: Date.today.iso8601, shop: "X", amount_cents: -100,
        splits: [{ amount_cents: -60 }, { amount_cents: -60 }]
      }
    })

    expect(result.dig("result", "isError")).to be(true)
    expect(Transaction.count).to eq(0)
  end

  it "returns a tool error for invalid input" do
    result = mcp_request("tools/call", {
      name: "create_transaction",
      arguments: { account_id: account.id.to_s, date: "not-a-date", shop: "X", amount_cents: -1 }
    })

    expect(result.dig("result", "isError")).to be(true)
  end
end
