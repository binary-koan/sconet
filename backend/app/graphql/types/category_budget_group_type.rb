# frozen_string_literal: true

module Types
  class CategoryBudgetGroupType < Types::BaseObject
    field :total_spending, Types::MoneyType, null: false
    field :categories, [Types::CategoryBudgetSpendingType], null: false
  end
end
