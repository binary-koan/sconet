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
        }.except(:budget_cents, :budget_currency_id))

        if category_input[:budget_cents].present? && category_input[:budget_currency_id].present? && (
          category_input[:budget_cents] != category.current_budget&.budget_cents ||
          category_input[:budget_currency_id] != category.current_budget&.currency_id
        )
          category.current_budget&.update!(date_to: Time.zone.now.beginning_of_month)
          category.category_budgets.create!(
            date_from: Time.zone.now.beginning_of_month,
            budget_cents: category_input[:budget_cents],
            currency_id: category_input[:budget_currency_id]
          )
        end
      end

      { category: category }
    end
  end
end
