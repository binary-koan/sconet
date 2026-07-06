module McpTools
  READ_ONLY = { read_only_hint: true, destructive_hint: false, idempotent_hint: true, open_world_hint: false }.freeze

  def self.text_response(data)
    MCP::Tool::Response.new([{ type: "text", text: JSON.pretty_generate(data) }])
  end

  def self.error_response(message)
    MCP::Tool::Response.new([{ type: "text", text: message }], error: true)
  end

  def self.transaction_json(transaction)
    {
      id: transaction.id,
      date: transaction.date,
      shop: transaction.shop,
      memo: transaction.memo,
      amount_cents: transaction.amount_cents,
      currency: transaction.currency&.code,
      category: transaction.category&.name,
      account: transaction.account.name,
      confirmed: transaction.confirmed,
      include_in_reports: transaction.include_in_reports,
      receipt_images: transaction.receipt_images.map { |image| image.filename.to_s }
    }
  end

  class GetCategories < MCP::Tool
    tool_name "get_categories"
    description "List all non-archived transaction categories"
    annotations(McpTools::READ_ONLY)
    input_schema(properties: {}, required: [])

    def self.call(server_context:)
      McpTools.text_response(
        Category.where(archived_at: nil).order(:sort_order).map do |category|
          { id: category.id, name: category.name, emoji: category.emoji, color: category.color, is_regular: category.regular? }
        end
      )
    end
  end

  class GetCurrencies < MCP::Tool
    tool_name "get_currencies"
    description "List all currencies"
    annotations(McpTools::READ_ONLY)
    input_schema(properties: {}, required: [])

    def self.call(server_context:)
      McpTools.text_response(
        Currency.order(:code).map do |currency|
          { id: currency.id, code: currency.code, name: currency.name, symbol: currency.symbol, decimal_digits: currency.decimal_digits }
        end
      )
    end
  end

  class GetAccounts < MCP::Tool
    tool_name "get_accounts"
    description "List all non-archived accounts"
    annotations(McpTools::READ_ONLY)
    input_schema(properties: {}, required: [])

    def self.call(server_context:)
      McpTools.text_response(
        Account.where(archived_at: nil).order(:sort_order).map do |account|
          { id: account.id, name: account.name, currency: account.currency.code }
        end
      )
    end
  end

  class GetRecentTransactions < MCP::Tool
    tool_name "get_recent_transactions"
    description "List the most recent transactions, newest first"
    annotations(McpTools::READ_ONLY)
    input_schema(
      properties: { limit: { type: "integer", description: "Max transactions to return (default 20)" } },
      required: []
    )

    def self.call(limit: 20, server_context:)
      McpTools.text_response(
        Transaction.top_level.in_display_order.limit(limit).map { |transaction| McpTools.transaction_json(transaction) }
      )
    end
  end

  class CreateTransaction < MCP::Tool
    tool_name "create_transaction"
    description "Adds a new expense or income record to the user's personal finance ledger, optionally with line-item " \
                "splits and receipt images. Existing records are not modified. " \
                "The account_id, currency_id, and category_id values come from the get_accounts, get_currencies, and " \
                "get_categories tools. Amounts are integers in the currency's minor units per its decimal_digits " \
                "(JPY x1, GBP/CZK x100); negative values are expenses, positive are income or refunds. " \
                "A purchase in a currency other than the account's is recorded via shop_amount_cents + shop_currency_id " \
                "(the original amount; the app converts), with amount_cents left unset."
    annotations(destructive_hint: false, idempotent_hint: false, open_world_hint: false, read_only_hint: false)
    input_schema(
      properties: {
        account_id: { type: "string" },
        date: { type: "string", description: "ISO8601 date, e.g. 2026-07-04" },
        shop: { type: "string", description: "Merchant name" },
        amount_cents: {
          type: "integer",
          description: "Signed minor units (negative = expense); unset when shop_amount_cents is used"
        },
        category_id: {
          type: "string",
          description: "Optional; an uncategorised transaction is valid and the user can categorise it later"
        },
        currency_id: { type: "string", description: "Defaults to the account's currency" },
        shop_amount_cents: {
          type: "integer",
          description: "Signed minor units in the original purchase currency, when it differs from the account's; " \
                       "requires shop_currency_id"
        },
        shop_currency_id: { type: "string", description: "Currency id of shop_amount_cents" },
        memo: { type: "string", description: "Blank when splits are given — each split carries its own memo" },
        confirmed: { type: "boolean", description: "When false, the transaction is held as a draft for the user to review in the app" },
        include_in_reports: { type: "boolean" },
        allow_duplicate: {
          type: "boolean",
          description: "By default, creating a transaction with the same amount, currency, and date as an existing one " \
                       "fails. Set true to create it anyway — only after confirming with the user that it is not a duplicate"
        },
        splits: {
          type: "array",
          description: "Line-item splits. Amounts are signed like the parent and must sum exactly to the parent amount " \
                       "(shop_amount_cents if set, else amount_cents)",
          items: {
            type: "object",
            properties: {
              amount_cents: { type: "integer", description: "Signed minor units, same sign convention as the parent" },
              memo: { type: "string" },
              category_id: { type: "string" }
            },
            required: %w[amount_cents]
          }
        },
        receipt_images: {
          type: "array",
          description: "Receipt photos to attach. Each entry references a previously uploaded image by blob_signed_id " \
                       "(returned by this server's upload endpoint), or carries inline base64 data for small images. " \
                       "One uploaded image can back several transactions, each with its own crop",
          items: {
            type: "object",
            properties: {
              blob_signed_id: { type: "string", description: "Signed id returned by POST /mcp/uploads" },
              data: { type: "string", description: "Base64-encoded image data (requires filename and content_type)" },
              filename: { type: "string" },
              content_type: { type: "string", description: "e.g. image/jpeg" },
              crop: {
                type: "object",
                description: "Optional pixel rectangle to crop the image to before attaching",
                properties: {
                  x: { type: "integer" },
                  y: { type: "integer" },
                  width: { type: "integer" },
                  height: { type: "integer" }
                },
                required: %w[x y width height]
              }
            },
            required: []
          }
        }
      },
      required: %w[account_id date shop]
    )

    def self.call(account_id:, date:, shop:, amount_cents: nil, category_id: nil, currency_id: nil,
                  shop_amount_cents: nil, shop_currency_id: nil, memo: "", confirmed: true,
                  include_in_reports: true, allow_duplicate: false, splits: [], receipt_images: [], server_context:)
      account = Account.find(account_id)

      expected_total = shop_amount_cents || amount_cents
      if splits.present? && splits.sum { |split| split[:amount_cents] } != expected_total
        return McpTools.error_response("Split amounts do not sum to the transaction amount")
      end

      transaction = Transaction.new(
        account:,
        currency_id: currency_id || account.currency_id,
        date: Date.iso8601(date),
        shop:,
        memo:,
        amount_cents:,
        shop_amount_cents:,
        shop_currency_id:,
        category_id:,
        confirmed:,
        include_in_reports:
      )
      transaction.allow_duplicate = allow_duplicate

      Transaction.transaction do
        transaction.save!

        splits.each do |split|
          attributes = { memo: split[:memo] || "", category_id: split[:category_id], confirmed:, include_in_reports: }
          if shop_amount_cents.present?
            attributes[:shop_amount_cents] = split[:amount_cents]
          else
            attributes[:amount_cents] = split[:amount_cents]
          end

          transaction.split_to.create!(
            transaction.attributes.symbolize_keys.slice(*Mutations::TransactionUpdate::PARENT_ATTRIBUTES).merge(attributes)
          )
        end
      end

      receipt_images.each do |image|
        if (signed_id = image[:blob_signed_id])
          blob = ActiveStorage::Blob.find_signed!(signed_id)
          if (crop = image[:crop])
            io = ImageCropper.crop(StringIO.new(blob.download), x: crop[:x], y: crop[:y], width: crop[:width], height: crop[:height])
            transaction.receipt_images.attach(io:, filename: "#{blob.filename.base}.jpg", content_type: "image/jpeg")
          else
            transaction.receipt_images.attach(blob)
          end
        else
          io = StringIO.new(Base64.decode64(image[:data]))
          filename = image[:filename]
          content_type = image[:content_type]
          if (crop = image[:crop])
            io = ImageCropper.crop(io, x: crop[:x], y: crop[:y], width: crop[:width], height: crop[:height])
            filename = "#{File.basename(filename, '.*')}.jpg"
            content_type = "image/jpeg"
          end

          transaction.receipt_images.attach(io:, filename:, content_type:)
        end
      end

      McpTools.text_response(McpTools.transaction_json(transaction))
    rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotFound, Date::Error,
           ActiveSupport::MessageVerifier::InvalidSignature, Vips::Error => e
      McpTools.error_response(e.message)
    end
  end

  ALL = [GetCategories, GetCurrencies, GetAccounts, GetRecentTransactions, CreateTransaction].freeze
end
