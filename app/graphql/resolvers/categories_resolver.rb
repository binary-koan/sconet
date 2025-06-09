module Resolvers
  class CategoriesResolver < BaseResolver
    authenticated

    argument :archived, Boolean, required: false, default_value: false

    type [Types::CategoryType], null: false

    def resolve(archived: false)
      if archived
        ::Category.where.not(archived_at: nil).order(:sort_order)
      else
        ::Category.where(archived_at: nil).order(:sort_order)
      end
    end
  end
end
