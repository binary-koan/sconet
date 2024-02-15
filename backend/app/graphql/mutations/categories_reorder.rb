# frozen_string_literal: true

module Mutations
  class CategoriesReorder < BaseMutation
    authenticated

    description "Reorders categories"

    field :categories, [Types::CategoryType], null: false

    argument :ordered_ids, [ID], required: true

    def resolve(ordered_ids:)
      categories = ::Category.all.index_by(&:id)

      if ordered_ids.sort != categories.keys.sort
        raise GraphqlErrors::ValidationError.new "Must include all category IDs"
      end

      ordered_ids.each_with_index do |id, index|
        categories[id].update_attribute(:sort_order, index + 1)
      end

      { categories: categories.values.sort_by(&:sort_order) }
    end
  end
end
