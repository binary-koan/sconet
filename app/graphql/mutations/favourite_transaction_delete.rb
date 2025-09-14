# frozen_string_literal: true

module Mutations
  class FavouriteTransactionDelete < BaseMutation
    authenticated

    description "Deletes a favourite transaction by ID"

    field :favourite_transaction, Types::FavouriteTransactionType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      record = current_user.favourite_transactions.find(id)
      record.destroy!

      { favourite_transaction: record }
    end
  end
end


