# frozen_string_literal: true

module Mutations
  class CategoryDelete < BaseMutation
    authenticated

    description "Deletes a category by ID"

    field :category, Types::CategoryType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      category = ::Category.find(id)
      category.transaction do
        category.mark_deleted!
        category.category_budgets.each(&:mark_deleted!)
        category.transactions.each(&:mark_deleted!)
      end

      { category: category }
    end
  end
end
