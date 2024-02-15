module Resolvers
  class CurrencyResolver < BaseResolver
    authenticated

    type Types::CurrencyType, null: true

    argument :id, ID, required: true

    def resolve(id:)
      ::Currency.find_by(id:)
    end
  end
end
