# frozen_string_literal: true

module Types
  class FavouriteTransactionType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :shop, String, null: false
    field :memo, String, null: false
    field :price_cents, Integer, null: true
    field :account, Types::AccountType, null: true
    field :category, Types::CategoryType, null: true
  end
end


