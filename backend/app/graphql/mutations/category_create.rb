# frozen_string_literal: true

module Mutations
  class CategoryCreate < BaseMutation
    authenticated

    description "Creates a new category"

    field :category, Types::CategoryType, null: false

    argument :category_input, Types::CategoryInputType, required: true

    def resolve(category_input:)
      category = ::Category.new({
        **category_input,
        regular: category_input[:is_regular],
        sort_order: Category.maximum(:sort_order).to_i + 1
      }.except(:is_regular, :budget_cents, :budget_currency_id))

      if category_input[:budget_cents].present? && category_input[:budget_currency_id].present?
        category.category_budgets.build(
          date_from: Time.zone.now.beginning_of_month,
          budget_cents: category_input[:budget_cents],
          currency_id: category_input[:budget_currency_id]
        )
      end

      raise GraphQL::ExecutionError.new "Error creating category", extensions: category.errors.to_hash unless category.save

      { category: category }
    end
  end
end
