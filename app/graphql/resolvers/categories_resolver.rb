module Resolvers
  class CategoriesResolver < BaseResolver
    authenticated

    type [Types::CategoryType], null: false

    def resolve
      ::Category.order(:sort_order)
    end
  end
end
