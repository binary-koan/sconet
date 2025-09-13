# frozen_string_literal: true

module Mutations
  class TransactionSplit < BaseMutation
    authenticated

    field :transaction, Types::TransactionType, null: false

    argument :id, ID, required: true
    argument :splits, [Types::TransactionSplitItemInputType], required: true
    argument :total_amount_cents, Integer, required: false
    argument :date, GraphQL::Types::ISO8601Date, required: false

    def resolve(id:, splits:, total_amount_cents: nil, date: nil)
      transaction = Transaction.find(id)

      expected_total_cents = total_amount_cents || (transaction.shop_amount_cents || transaction.amount_cents)

      if splits.sum { |split| split.amount_cents } != expected_total_cents
        raise GraphqlErrors::ValidationError, "Transaction amounts do not match"
      end

      if transaction.split_from_id.present?
        raise GraphqlErrors::ValidationError, "Transaction is already split from #{transaction.split_from_id}"
      end

      transaction.transaction do
        updates = {}
        updates[:date] = date if date.present?

        if total_amount_cents.present?
          if transaction.shop_amount_cents.present?
            updates[:shop_amount_cents] = total_amount_cents
          else
            updates[:amount_cents] = total_amount_cents
          end
        end

        transaction.update!(**updates) if updates.present?

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
