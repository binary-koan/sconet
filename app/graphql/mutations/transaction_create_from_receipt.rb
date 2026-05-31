# frozen_string_literal: true

module Mutations
  class TransactionCreateFromReceipt < BaseMutation
    authenticated

    description "Creates a placeholder transaction with an attached receipt image"

    field :transaction, Types::TransactionType, null: false

    argument :receipt_image, Types::UploadType, required: true

    def resolve(receipt_image:)
      account = current_user.default_account || ::Account.where(archived_at: nil).order(:sort_order).first
      raise GraphQL::ExecutionError, "No account available to attach receipt to" unless account

      transaction = ::Transaction.new(
        account: account,
        currency: account.currency,
        date: Date.current,
        shop: "Receipt",
        amount_cents: 0
      )

      raise GraphQL::ExecutionError.new("Error creating transaction", extensions: transaction.errors.to_hash) unless transaction.save

      transaction.receipt_images.attach(receipt_image)

      { transaction: transaction }
    end
  end
end
