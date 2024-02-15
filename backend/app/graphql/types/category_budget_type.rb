# frozen_string_literal: true

module Types
  class CategoryBudgetType < Types::BaseObject
    field :id, ID, null: false
    field :date_from, GraphQL::Types::ISO8601Date, null: false
    field :date_to, GraphQL::Types::ISO8601Date
    field :budget, Types::MoneyType, null: false do
      argument :date, GraphQL::Types::ISO8601Date, required: false
      argument :currency_id, ID, required: false
    end
    field :currency, Types::CurrencyType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def budget(date: nil, currency_id: nil)
      ExchangeRates::ConvertMoney.new(
        [object.budget.on_date(date || object.date_from)],
        to_currency: currency_id.present? ? Currency.find(currency_id) : object.currency
      ).call.first
    end
  end
end
