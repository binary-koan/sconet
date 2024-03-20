module Resolvers
  class BudgetResolver < BaseResolver
    authenticated

    type Types::MonthBudgetType, null: false

    argument :year, Integer, required: true
    argument :month, Integer, required: true
    argument :currency_id, ID, required: false

    def resolve(year:, month:, currency_id: nil)
      output_currency = Currency.find_by(id: currency_id) || current_user.default_currency || Currency.first
      start = Date.new(year, month, 1)
      finish = start.end_of_month

      transactions = Transaction.includes(:category).for_analytics.where('date >= ? AND date <= ?', start, finish)
      ExchangeRates::AttachToTransactions.new(transactions, output_currency).call

      spending_categories = transactions.select(&:expense?).map(&:category).uniq.sort_by { |category| category&.sort_order || -1 }

      all_categories = spending_categories.map do |category|
        budget = ExchangeRates::ConvertMoney.new([category.current_budget.budget], to_currency: output_currency).call.first if category.current_budget
        amount_spent = Monies.new(
          transactions.select(&:expense?).select { |transaction| transaction.category == category }.map(&:amount_in_currency),
          output_currency
        ).sum.abs

        {
          id: "#{year}-#{month}-#{category&.id || "uncategorized"}",
          category:,
          amount_spent:,
          remaining_budget: (budget - amount_spent if budget)
        }
      end

      income = Monies.new(transactions.select(&:income?).map(&:amount_in_currency), output_currency).sum
      total_spending = Monies.new(transactions.select(&:expense?).map(&:amount_in_currency), output_currency).sum.abs
      regular_categories, irregular_categories = all_categories.partition { |category| category[:category]&.regular? }

      {
        id: "#{year}-#{month}",
        year:,
        month:,
        income:,
        total_spending:,
        difference: income - total_spending,
        regular_categories: {
          total_spending: Monies.new(regular_categories.pluck(:amount_spent), output_currency).sum,
          categories: regular_categories
        },
        irregular_categories: {
          total_spending: Monies.new(irregular_categories.pluck(:amount_spent), output_currency).sum,
          categories: irregular_categories
        }
      }
    end
  end
end
