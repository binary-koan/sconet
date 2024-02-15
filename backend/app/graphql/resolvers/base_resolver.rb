module Resolvers
  class BaseResolver < GraphQL::Schema::Resolver
    include GraphqlHelpers
  end
end
