# frozen_string_literal: true

module Types
  class MonthBalanceType < Types::BaseObject
    field :id, String, null: false
    field :month, Integer, null: false
    field :year, Integer, null: false
    field :income, Types::MoneyType, null: false
    field :total_spending, Types::MoneyType, null: false
    field :difference, Types::MoneyType, null: false
  end
end
