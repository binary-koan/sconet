module Resolvers
  class CategoryResolver < BaseResolver
    authenticated

    type Types::CategoryType, null: true

    argument :id, ID, required: true

    def resolve(id:)
      ::Category.find_by(id:)
    end
  end
end
