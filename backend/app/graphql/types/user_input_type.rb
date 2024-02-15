# frozen_string_literal: true

module Types
  class UserInputType < Types::BaseInputObject
    argument :email, String, required: false
    argument :default_currency_id, ID, required: false
    argument :default_account_id, ID, required: false

    argument :old_password, String, required: false
    argument :new_password, String, required: false
  end
end
