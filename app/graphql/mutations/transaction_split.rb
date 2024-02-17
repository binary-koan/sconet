# frozen_string_literal: true

module Mutations
  class TransactionSplit < BaseMutation
    authenticated

    field :transaction, Types::TransactionType, null: false

    argument :id, ID, required: true
    argument :splits, [Types::TransactionSplitItemInputType], required: true

    def resolve(id:, splits:)
      transaction = Transaction.find(id)

      if splits.sum { |split| split.amount_cents } != (transaction.shop_amount_cents || transaction.amount_cents)
        raise GraphqlErrors::ValidationError, "Transaction amounts do not match"
      end

      if transaction.split_from_id.present?
        raise GraphqlErrors::ValidationError, "Transaction is already split from #{transaction.split_from_id}"
      end

      transaction.transaction do
        transaction.split_to.destroy_all

        splits.each do |split|
          attributes = { **split }.except(:amount)

          if transaction.shop_amount_cents.present?
            attributes[:shop_amount_cents] = split.amount_cents
          else
            attributes[:amount_cents] = split.amount_cents
          end

          if attributes[:shop_amount_cents].present? && transaction.amount_cents.present?
            attributes[:amount_cents] = (transaction.amount_cents.to_d / transaction.shop_amount_cents.to_d) * attributes[:shop_amount_cents]
          end

          transaction.split_to.create!(transaction.attributes.symbolize_keys.slice(*Mutations::TransactionUpdate::PARENT_ATTRIBUTES).merge(attributes))
        end
      end

      { transaction: }
    end
  end
end
