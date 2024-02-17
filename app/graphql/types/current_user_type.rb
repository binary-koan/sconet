# frozen_string_literal: true

module Types
  class CurrentUserType < Types::BaseObject
    field :id, ID, null: false
    field :email, String, null: false
    field :default_currency, Types::CurrencyType
    field :favourite_currencies, [Types::CurrencyType], null: false
    field :default_account, Types::AccountType
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :registered_credentials, [Types::UserCredentialType], null: false

    def registered_credentials
      object.user_credentials
    end
  end
end
