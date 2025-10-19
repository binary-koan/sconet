# frozen_string_literal: true

module Mutations
  class TransactionUpdate < BaseMutation
    PARENT_ATTRIBUTES = %i(date shop account_id currency_id shop_currency_id)

    authenticated

    description "Updates a transaction by id"

    field :transaction, Types::TransactionType, null: false

    argument :id, ID, required: true
    argument :transaction_input, Types::TransactionInputType, required: true

  def resolve(id:, transaction_input:)
    transaction = ::Transaction.find(id)
    transaction_input = { **transaction_input }
    receipt_images = transaction_input.delete(:receipt_images)

    if transaction.split_from_id.present?
      transaction_input = transaction_input.except(*PARENT_ATTRIBUTES)
    end

    transaction.transaction do
      transaction.update!(**transaction_input)
      
      if receipt_images.present?
        transaction.receipt_images.attach(receipt_images)
      end
      
      transaction.split_to.update_all(transaction_input.slice(*PARENT_ATTRIBUTES)) if transaction_input.slice(*PARENT_ATTRIBUTES).present?
      Transactions::UpdateSplitAmounts.new(transaction).call
    end

    { transaction: }
  end
  end
end
