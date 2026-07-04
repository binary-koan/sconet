require 'rails_helper'
require 'vips'

describe Mutations::ReceiptImageReplace do
  include GraphqlSpecHelpers

  let(:currency) { create(:currency) }
  let(:account) { create(:account, currency: currency) }
  let(:current_user) { create(:user, default_account: account) }

  let(:transaction) do
    create(:transaction, account: account, currency: currency).tap do |transaction|
      transaction.receipt_images.attach(
        io: StringIO.new("original-bytes"),
        filename: "receipt.jpg",
        content_type: "image/jpeg"
      )
    end
  end

  let(:upload) do
    Rack::Test::UploadedFile.new(
      StringIO.new("rotated-bytes"),
      "image/jpeg",
      original_filename: "rotated.jpg"
    )
  end

  let(:query_string) do
    <<~GRAPHQL
      mutation($id: ID!, $image: Upload!) {
        receiptImageReplace(input: { id: $id, image: $image }) {
          transaction { id }
        }
      }
    GRAPHQL
  end

  it "requires authentication" do
    execute_graphql variables: { id: transaction.receipt_images.first.id, image: upload }, query_string: query_string

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "replaces the image content, keeping the attachment and filename" do
    attachment = transaction.receipt_images.first
    old_blob = attachment.blob

    execute_graphql current_user:, variables: { id: attachment.id, image: upload }, query_string: query_string
    expect_graphql_success

    attachment.reload
    expect(attachment.blob.download).to eq("rotated-bytes")
    expect(attachment.filename.to_s).to eq("receipt.jpg")
    expect(ActiveStorage::Blob.exists?(old_blob.id)).to be(false)
  end

  it "crops the image when a crop rectangle is given" do
    attachment = transaction.receipt_images.first

    png = Tempfile.new(%w[source .png])
    Vips::Image.black(100, 80).write_to_file(png.path)
    upload = Rack::Test::UploadedFile.new(png.path, "image/png")

    query_string = <<~GRAPHQL
      mutation($id: ID!, $image: Upload!, $crop: CropInput!) {
        receiptImageReplace(input: { id: $id, image: $image, crop: $crop }) {
          transaction { id }
        }
      }
    GRAPHQL

    execute_graphql current_user:,
      variables: { id: attachment.id, image: upload, crop: { x: 10, y: 20, width: 30, height: 40 } },
      query_string: query_string
    expect_graphql_success

    cropped = Vips::Image.new_from_buffer(attachment.reload.blob.download, "")
    expect([cropped.width, cropped.height]).to eq([30, 40])
  end
end
