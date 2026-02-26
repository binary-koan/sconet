# frozen_string_literal: true

module Mutations
  class CurrencyCreate < BaseMutation
    authenticated

    description "Creates a new currency"

    field :currency, Types::CurrencyType, null: false

    argument :code, String, required: true
    argument :name, String, required: true
    argument :symbol, String, required: true
    argument :decimal_digits, Integer, required: true

    def resolve(code:, name:, symbol:, decimal_digits:)
      currency = ::Currency.new(code: code, name: name, symbol: symbol, decimal_digits: decimal_digits)
      raise GraphQL::ExecutionError.new "Error creating currency", extensions: currency.errors.to_hash unless currency.save

      { currency: currency }
    end
  end
end
