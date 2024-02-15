module Resolvers
  class TransactionsByDayResolver < BaseResolver
    authenticated

    type [Types::DailyTransactionsType], null: false

    argument :date_from, GraphQL::Types::ISO8601Date, required: true
    argument :date_until, GraphQL::Types::ISO8601Date, required: true

    def resolve(date_from:, date_until:)
      transactions = ::Transaction.where('date >= ? AND date <= ?', date_from, date_until).in_display_order.group_by(&:date)

      (date_from..date_until).map do |date|
        {
          date:,
          total_spent: (transactions[date] || []).select(&:amount_cents?).select(&:expense?).map(&:amount),
          transactions: transactions[date] || []
        }
      end
    end
  end
end
