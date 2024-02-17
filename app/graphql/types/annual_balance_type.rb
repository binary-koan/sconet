# frozen_string_literal: true

module Types
  class AnnualBalanceType < Types::BaseObject
    field :id, ID, null: false
    field :year, Integer, null: false
    field :currency, Types::CurrencyType, null: false
    field :income, Types::MoneyType, null: false
    field :total_spending, Types::MoneyType, null: false
    field :difference, Types::MoneyType, null: false
    field :months, [Types::MonthBalanceType], null: false
  end
end
