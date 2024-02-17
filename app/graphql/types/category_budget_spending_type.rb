# frozen_string_literal: true

module Types
  class CategoryBudgetSpendingType < Types::BaseObject
    field :id, ID, null: false
    field :category, Types::CategoryType, null: true
    field :amount_spent, Types::MoneyType, null: false
  end
end
