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
    description "Create a transaction, optionally with line-item splits and receipt images. " \
                "Call get_accounts, get_currencies, and get_categories first — never guess ids. " \
                "Amounts are in the currency's minor units using its decimal_digits (JPY x1, GBP/CZK x100, not a blanket x100): " \
                "negative for expenses, positive for income/refunds. " \
                "Use amount_cents + currency_id when the transaction is in the account's currency; for a purchase made in a " \
                "different currency, post the original amount to shop_amount_cents + shop_currency_id instead (leave " \
                "amount_cents unset; the app converts to the account currency)."
    input_schema(
      properties: {
        account_id: { type: "string" },
        date: { type: "string", description: "ISO8601 date, e.g. 2026-07-04" },
        shop: { type: "string", description: "Merchant name" },
        amount_cents: {
          type: "integer",
          description: "Signed minor units (negative = expense). Omit for foreign-currency receipts and use shop_amount_cents instead"
        },
        category_id: {
          type: "string",
          description: "Best-fit category; omit if nothing fits rather than forcing a bad match"
        },
        currency_id: { type: "string", description: "Defaults to the account's currency" },
        shop_amount_cents: {
          type: "integer",
          description: "Signed minor units in the original purchase currency, when it differs from the account's; " \
                       "requires shop_currency_id"
        },
        shop_currency_id: { type: "string", description: "Currency id of shop_amount_cents" },
        memo: { type: "string", description: "Leave blank when passing splits — each split carries its own memo" },
        confirmed: { type: "boolean", description: "Set false to leave the transaction unconfirmed for the user to review" },
        include_in_reports: { type: "boolean" },
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
          items: {
            type: "object",
            properties: {
              data: { type: "string", description: "Base64-encoded image data" },
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
            required: %w[data filename content_type]
          }
        }
      },
      required: %w[account_id date shop]
    )

    def self.call(account_id:, date:, shop:, amount_cents: nil, category_id: nil, currency_id: nil,
                  shop_amount_cents: nil, shop_currency_id: nil, memo: "", confirmed: true,
                  include_in_reports: true, splits: [], receipt_images: [], server_context:)
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
        io = StringIO.new(Base64.decode64(image[:data]))
        if (crop = image[:crop])
          io = ImageCropper.crop(io, x: crop[:x], y: crop[:y], width: crop[:width], height: crop[:height])
        end

        transaction.receipt_images.attach(
          io: io,
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
