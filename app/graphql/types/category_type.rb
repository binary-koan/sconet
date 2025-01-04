# frozen_string_literal: true

module Types
  class CategoryType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :color, String, null: false
    field :icon, String, null: false
    field :is_regular, Boolean, null: false
    field :sort_order, Integer, null: false
    field :has_transactions, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :budgets, [Types::CategoryBudgetType], null: false
    field :budget, Types::CategoryBudgetType, null: true do
      argument :date, GraphQL::Types::ISO8601Date, required: true
    end

    def is_regular
      object.regular?
    end

    def budgets
      object.category_budgets.order(:date_from)
    end

    def budget(date:)
      object.category_budgets.for_date(date)
    end

    def has_transactions
      object.transactions.any?
    end
  end
end
