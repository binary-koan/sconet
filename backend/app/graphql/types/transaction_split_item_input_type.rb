# frozen_string_literal: true

module Types
  class TransactionSplitItemInputType < Types::BaseInputObject
    argument :amount_cents, Integer, required: true
    argument :memo, String, required: false
    argument :category_id, String, required: false
  end
end
