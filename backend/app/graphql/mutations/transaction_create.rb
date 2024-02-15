# frozen_string_literal: true

module Mutations
  class TransactionCreate < BaseMutation
    authenticated

    description "Creates a new transaction"

    field :transaction, Types::TransactionType, null: false

    argument :transaction_input, Types::TransactionInputType, required: true

    def resolve(transaction_input:)
      transaction = ::Transaction.new(**transaction_input)
      raise GraphQL::ExecutionError.new "Error creating transaction", extensions: transaction.errors.to_hash unless transaction.save

      { transaction: transaction }
    end
  end
end
