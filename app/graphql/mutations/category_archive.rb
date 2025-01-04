# frozen_string_literal: true

module Mutations
  class CategoryArchive < BaseMutation
    authenticated

    description "Archives a category by ID"

    field :category, Types::CategoryType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      category = ::Category.find(id)
      category.update!(archived_at: Time.current)

      { category: category }
    end
  end
end
