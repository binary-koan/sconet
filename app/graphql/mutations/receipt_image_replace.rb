# frozen_string_literal: true

module Mutations
  class ReceiptImageReplace < BaseMutation
    authenticated

    description "Replaces a receipt image's file (e.g. with a client-rotated version)"

    field :transaction, Types::TransactionType, null: false

    argument :id, ID, required: true
    argument :image, Types::UploadType, required: true
    argument :crop, Types::CropInputType, required: false

    def resolve(id:, image:, crop: nil)
      attachment = ActiveStorage::Attachment.where(record_type: "Transaction", name: "receipt_images").find(id)
      old_blob = attachment.blob

      attachment.update!(blob: ActiveStorage::Blob.create_and_upload!(
        io: crop ? ImageCropper.crop(image, **crop.to_h) : image,
        filename: old_blob.filename.to_s,
        content_type: image.content_type
      ))
      old_blob.purge

      { transaction: attachment.record }
    end
  end
end
