module Resolvers
  class BalanceResolver < BaseResolver
    authenticated

    type Types::AnnualBalanceType, null: false

    argument :year, Integer, required: true
    argument :currency_id, ID, required: false

    def resolve(year:, currency_id: nil)
      output_currency = Currency.find_by(id: currency_id) || current_user.default_currency || Currency.first
      start = Date.new(year, 1, 1)
      finish = Date.new(year, 12, 31)

      all_transactions = Transaction.for_analytics.where('date >= ? AND date <= ?', start, finish)
      ExchangeRates::AttachToTransactions.new(all_transactions, output_currency).call

      transactions_by_month = all_transactions.group_by { |transaction| transaction.date.month }

      months = (1..12).map do |month|
        transactions = transactions_by_month[month] || []
        {
          id: "#{year}-#{month}",
          year:,
          month:,
          income: Monies.new(transactions.select(&:income?).map(&:amount_in_currency), output_currency).sum,
          total_spending: Monies.new(transactions.select(&:expense?).map(&:amount_in_currency), output_currency).sum.abs,
          difference: Monies.new(transactions.map(&:amount_in_currency), output_currency).sum
        }
      end

      {
        id: year.to_s,
        year:,
        currency: output_currency,
        income: Monies.new(all_transactions.select(&:income?).map(&:amount_in_currency), output_currency).sum,
        total_spending: Monies.new(all_transactions.select(&:expense?).map(&:amount_in_currency), output_currency).sum.abs,
        difference: Monies.new(all_transactions.map(&:amount_in_currency), output_currency).sum,
        months:
      }
    end
  end
end
