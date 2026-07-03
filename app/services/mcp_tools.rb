module McpTools
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
    description "Create a transaction. Amounts are in cents: negative for expenses, positive for income. " \
                "Optionally attach receipt images as base64-encoded data."
    input_schema(
      properties: {
        account_id: { type: "string" },
        date: { type: "string", description: "ISO8601 date, e.g. 2026-07-04" },
        shop: { type: "string" },
        amount_cents: { type: "integer", description: "Negative for expenses, positive for income" },
        category_id: { type: "string", description: "Omit for income transactions" },
        currency_id: { type: "string", description: "Defaults to the account's currency" },
        memo: { type: "string" },
        confirmed: { type: "boolean" },
        include_in_reports: { type: "boolean" },
        receipt_images: {
          type: "array",
          items: {
            type: "object",
            properties: {
              data: { type: "string", description: "Base64-encoded image data" },
              filename: { type: "string" },
              content_type: { type: "string", description: "e.g. image/jpeg" }
            },
            required: %w[data filename content_type]
          }
        }
      },
      required: %w[account_id date shop amount_cents]
    )

    def self.call(account_id:, date:, shop:, amount_cents:, category_id: nil, currency_id: nil, memo: "",
                  confirmed: true, include_in_reports: true, receipt_images: [], server_context:)
      account = Account.find(account_id)

      transaction = Transaction.new(
        account:,
        currency_id: currency_id || account.currency_id,
        date: Date.iso8601(date),
        shop:,
        memo:,
        amount_cents:,
        category_id:,
        confirmed:,
        include_in_reports:
      )
      transaction.save!

      receipt_images.each do |image|
        transaction.receipt_images.attach(
          io: StringIO.new(Base64.decode64(image[:data])),
          filename: image[:filename],
          content_type: image[:content_type]
        )
      end

      McpTools.text_response(McpTools.transaction_json(transaction))
    rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotFound, Date::Error => e
      McpTools.error_response(e.message)
    end
  end

  ALL = [GetCategories, GetCurrencies, GetAccounts, GetRecentTransactions, CreateTransaction].freeze
end
