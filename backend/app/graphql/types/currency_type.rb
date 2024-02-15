# frozen_string_literal: true

module Types
  class CurrencyType < Types::BaseObject
    field :id, ID, null: false
    field :code, String, null: false
    field :name, String, null: false
    field :symbol, String, null: false
    field :decimal_digits, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :exchange_rate, Float, null: false do
      argument :to, ID, required: true
      argument :date, GraphQL::Types::ISO8601Date, required: false
    end

    def exchange_rate(to:, date: nil)
      converted = ExchangeRates::ConvertMoney.new(
        [MoneyOnDate.new(date: date || Date.today, currency: object, amount_cents: 1 * (10 ** object.decimal_digits))],
        to_currency: Currency.find(to)
      ).call.first

      # Not accurate because of rounding, but close enough for the moment
      converted.amount_cents.to_d / (10 ** object.decimal_digits)
    end
  end
end
