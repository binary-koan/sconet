# frozen_string_literal: true

module Types
  class AccountInputType < Types::BaseInputObject
    argument :name, String, required: false
    argument :currency_id, ID, required: false
    argument :favourite, Boolean, required: false
  end
end
