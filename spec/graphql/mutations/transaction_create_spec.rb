require 'rails_helper'

describe Mutations::TransactionCreate do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }
  let(:currency) { create(:currency) }
  let(:account) { create(:account) }

  it "requires authentication" do
    execute_graphql variables: { id: "unknown" }, query_string: <<~GRAPHQL
      mutation {
        transactionCreate(input: { transactionInput: { shop: "Test", amountCents: -1000, currencyId: "#{currency.id}" } }) {
          transaction { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "creates an transaction" do
    expect do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          transactionCreate(input: { transactionInput: { accountId: "#{account.id}", date: "#{Date.today.iso8601}", shop: "Test", amountCents: -1000, currencyId: "#{currency.id}" } }) {
            transaction { id }
          }
        }
      GRAPHQL
      expect_graphql_success
    end.to change(Transaction, :count).by(1)

    expect(Transaction.find(graphql_data["transactionCreate"]["transaction"]["id"])).to have_attributes(
      shop: "Test",
      amount_cents: -1000,
      currency:
    )
  end
end
