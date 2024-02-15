# frozen_string_literal: true

module Types
  class DailyTransactionsType < Types::BaseObject
    field :date, GraphQL::Types::ISO8601Date, null: false
    field :total_spent, Types::MoneyType, null: false do
      argument :currency_id, ID, required: false
    end
    field :transactions, [Types::TransactionType], null: false

    def total_spent(currency_id: nil)
      currency = Currency.find_by(id: currency_id) || current_user.default_currency || Currency.first
      ExchangeRates::ConvertMoney.new(object[:total_spent], to_currency: currency).call.sum
    end
  end
end
