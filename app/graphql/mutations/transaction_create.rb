# frozen_string_literal: true

module Mutations
  class TransactionCreate < BaseMutation
    authenticated

    description "Creates a new transaction"

    field :transaction, Types::TransactionType, null: false

    argument :transaction_input, Types::TransactionInputType, required: true
    argument :allow_duplicate, Boolean, required: false, default_value: false,
             description: "Create the transaction even if one with the same amount, currency, and date already exists"

    def resolve(transaction_input:, allow_duplicate:)
      transaction = ::Transaction.new(**transaction_input)
      transaction.allow_duplicate = allow_duplicate

      unless transaction.save
        if transaction.errors.details[:base].any? { |detail| detail[:error] == :duplicate }
          raise GraphQL::ExecutionError.new "Duplicate transaction",
                                            extensions: { "code" => "DUPLICATE_TRANSACTION", **transaction.errors.to_hash }
        end

        raise GraphQL::ExecutionError.new "Error creating transaction", extensions: transaction.errors.to_hash
      end

      { transaction: transaction }
    end
  end
end
