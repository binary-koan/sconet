# frozen_string_literal: true

module Mutations
  class TransactionDelete < BaseMutation
    authenticated

    description "Deletes a transaction by ID"

    field :transaction, Types::TransactionType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      transaction = ::Transaction.find(id)
      transaction.transaction do
        transaction.mark_deleted!
        transaction.split_to.each(&:mark_deleted!)
      end

      { transaction: transaction }
    end
  end
end
