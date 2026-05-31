require 'rails_helper'

describe Mutations::TransactionCreateFromReceipt do
  include GraphqlSpecHelpers

  let(:currency) { create(:currency) }
  let(:account) { create(:account, currency: currency) }
  let(:current_user) { create(:user, default_account: account) }

  let(:upload) do
    Rack::Test::UploadedFile.new(
      StringIO.new("fake-image-bytes"),
      "image/jpeg",
      original_filename: "receipt.jpg"
    )
  end

  it "requires authentication" do
    execute_graphql variables: { receiptImage: upload }, query_string: <<~GRAPHQL
      mutation($receiptImage: Upload!) {
        transactionCreateFromReceipt(input: { receiptImage: $receiptImage }) {
          transaction { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "creates a placeholder transaction with the receipt attached" do
    expect do
      execute_graphql current_user:, variables: { receiptImage: upload }, query_string: <<~GRAPHQL
        mutation($receiptImage: Upload!) {
          transactionCreateFromReceipt(input: { receiptImage: $receiptImage }) {
            transaction { id shop date }
          }
        }
      GRAPHQL
      expect_graphql_success
    end.to change(Transaction, :count).by(1)

    transaction = Transaction.find(graphql_data["transactionCreateFromReceipt"]["transaction"]["id"])
    expect(transaction).to have_attributes(
      shop: "Receipt",
      amount_cents: 0,
      currency: currency,
      account: account,
      date: Date.current
    )
    expect(transaction.receipt_images).to be_attached
  end
end
