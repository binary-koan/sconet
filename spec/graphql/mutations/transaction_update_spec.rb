require 'rails_helper'

describe Mutations::TransactionUpdate do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }
  let(:currency) { create(:currency) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        transactionUpdate(input: { id: "test", transactionInput: { memo: "Test" } }) {
          transaction { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "errors with a nonexistent id" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        transactionUpdate(input: { id: "unknown", transactionInput: { memo: "Test" } }) {
          transaction { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::NotFoundError
  end

  context "for an existing transaction" do
    let(:transaction) { create(:transaction) }

    it "updates the transaction" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          transactionUpdate(input: { id: "#{transaction.id}", transactionInput: { memo: "Test2" } }) {
            transaction { id }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["transactionUpdate"]["transaction"]["id"]).to eq transaction.id
      expect(transaction.reload.memo).to eq "Test2"
    end
  end

  context "for a split transaction" do
    let(:currency) { create(:currency) }
    let(:transaction) { create(:transaction, currency:, amount_cents: 1000) }
    let!(:split1) { create(:transaction, currency:, amount_cents: 700, split_from: transaction) }
    let!(:split2) { create(:transaction, currency:, amount_cents: 300, split_from: transaction) }

    it "updates fields on the splits" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          transactionUpdate(input: { id: "#{transaction.id}", transactionInput: { shop: "Test2", amountCents: 500 } }) {
            transaction { id }
          }
        }
      GRAPHQL

      expect(transaction.reload).to have_attributes(shop: "Test2", amount_cents: 500)
      expect(split1.reload).to have_attributes(shop: "Test2", amount_cents: 350)
      expect(split2.reload).to have_attributes(shop: "Test2", amount_cents: 150)
    end
  end
end
