# frozen_string_literal: true

module Mutations
  class TransactionCreateFromReceipt < BaseMutation
    authenticated

    description "Creates a placeholder transaction with an attached receipt image"

    field :transaction, Types::TransactionType, null: false

    argument :receipt_image, Types::UploadType, required: true
    argument :crop, Types::CropInputType, required: false

    def resolve(receipt_image:, crop: nil)
      account = current_user.default_account || ::Account.where(archived_at: nil).order(:sort_order).first
      raise GraphQL::ExecutionError, "No account available to attach receipt to" unless account

      transaction = ::Transaction.new(
        account: account,
        currency: account.currency,
        date: Date.current,
        shop: "Receipt",
        amount_cents: 0,
        confirmed: false
      )

      raise GraphQL::ExecutionError.new("Error creating transaction", extensions: transaction.errors.to_hash) unless transaction.save

      if crop
        transaction.receipt_images.attach(
          io: ImageCropper.crop(receipt_image, **crop.to_h),
          filename: receipt_image.original_filename,
          content_type: receipt_image.content_type
        )
      else
        transaction.receipt_images.attach(receipt_image)
      end

      { transaction: transaction }
    end
  end
end
