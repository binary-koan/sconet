# frozen_string_literal: true

module Mutations
  class CategoryUpdate < BaseMutation
    authenticated

    description "Updates a category by id"

    field :category, Types::CategoryType, null: false

    argument :id, ID, required: true
    argument :category_input, Types::CategoryInputType, required: true

    def resolve(id:, category_input:)
      category = ::Category.find(id)

      category.transaction do
        category.update!({
          **category_input,
          regular: category_input[:is_regular]
        }.except(:is_regular, :budget_cents, :budget_currency_id))

        if category_input[:budget_cents].present? && category_input[:budget_currency_id].present? && (
          category_input[:budget_cents] != category.current_budget&.budget_cents ||
          category_input[:budget_currency_id] != category.current_budget&.currency_id
        )
          if category.current_budget&.date_from == Date.current.beginning_of_month
            category.current_budget.update!(
              budget_cents: category_input[:budget_cents],
              currency_id: category_input[:budget_currency_id]
            )
          else
            category.current_budget&.update!(date_to: (Date.current.beginning_of_month - 1.day))
            category.category_budgets.create!(
              date_from: Date.current.beginning_of_month,
              budget_cents: category_input[:budget_cents],
              currency_id: category_input[:budget_currency_id]
            )
          end
        end
      end

      { category: category }
    end
  end
end
