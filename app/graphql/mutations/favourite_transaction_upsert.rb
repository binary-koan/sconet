# frozen_string_literal: true

module Mutations
  class FavouriteTransactionUpsert < BaseMutation
    authenticated

    description "Creates or updates a favourite transaction setting for a shop"

    field :favourite_transaction, Types::FavouriteTransactionType, null: false

    argument :name, String, required: true
    argument :shop, String, required: true
    argument :memo, String, required: false
    argument :price_cents, Integer, required: false
    argument :account_id, ID, required: false
    argument :category_id, ID, required: false

    def resolve(name:, shop:, memo: nil, price_cents: nil, account_id: nil, category_id: nil)
      record = current_user.favourite_transactions.new
      record.update!(name:, shop:, memo: memo || "", price_cents:, account_id:, category_id:)

      { favourite_transaction: record }
    end
  end
end


