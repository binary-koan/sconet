# frozen_string_literal: true

module Types
  class TransactionInputType < Types::BaseInputObject
    argument :id, ID, required: false
    argument :shop, String, required: false
    argument :memo, String, required: false
    argument :date, GraphQL::Types::ISO8601Date, required: false
    argument :include_in_reports, Boolean, required: false
    argument :amount_cents, Integer, required: false
    argument :currency_id, ID, required: false
    argument :shop_amount_cents, Integer, required: false
    argument :shop_currency_id, ID, required: false
    argument :category_id, ID, required: false
    argument :account_id, ID, required: false
    argument :split_from_id, ID, required: false
  end
end
