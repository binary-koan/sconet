# frozen_string_literal: true

module Types
  class AccountType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :currency, Types::CurrencyType, null: false
    field :has_transactions, Boolean, null: false
    field :favourite, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def has_transactions
      object.transactions.any?
    end
  end
end
