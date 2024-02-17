# frozen_string_literal: true

module Types
  class MonthBudgetType < Types::BaseObject
    field :id, ID, null: false
    field :month, Integer, null: false
    field :year, Integer, null: false
    field :income, Types::MoneyType, null: false
    field :total_spending, Types::MoneyType, null: false
    field :difference, Types::MoneyType, null: false
    field :regular_categories, Types::CategoryBudgetGroupType, null: false
    field :irregular_categories, Types::CategoryBudgetGroupType, null: false
  end
end
