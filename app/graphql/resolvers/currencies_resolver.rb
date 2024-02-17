module Resolvers
  class CurrenciesResolver < BaseResolver
    authenticated

    type [Types::CurrencyType], null: false

    def resolve
      ::Currency.order(:code)
    end
  end
end
