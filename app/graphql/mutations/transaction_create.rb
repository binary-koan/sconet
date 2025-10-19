# frozen_string_literal: true

module Mutations
  class TransactionCreate < BaseMutation
    authenticated

    description "Creates a new transaction"

    field :transaction, Types::TransactionType, null: false

    argument :transaction_input, Types::TransactionInputType, required: true

    def resolve(transaction_input:)
      receipt_images = transaction_input[:receipt_images]
      transaction = ::Transaction.new(**transaction_input)

      if receipt_images.present?
        transaction.receipt_images.attach(receipt_images)
      end
      
      raise GraphQL::ExecutionError.new "Error creating transaction", extensions: transaction.errors.to_hash unless transaction.save

      { transaction: transaction }
    end
  end
end
