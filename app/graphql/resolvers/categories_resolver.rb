module Resolvers
  class CategoriesResolver < BaseResolver
    authenticated

    type [Types::CategoryType], null: false

    def resolve
      ::Category.where(archived_at: nil).order(:sort_order)
    end
  end
end
