# frozen_string_literal: true

module Types
  class TransactionFilterInputType < Types::BaseInputObject
    argument :date_from, GraphQL::Types::ISO8601Date, required: false
    argument :date_until, GraphQL::Types::ISO8601Date, required: false
    argument :min_amount_cents, Integer, required: false
    argument :max_amount_cents, Integer, required: false
    argument :keyword, String, required: false
    argument :category_ids, [ID, null: true], required: false
  end
end
