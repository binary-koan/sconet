require 'rails_helper'

describe Mutations::TransactionDelete do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        transactionDelete(input: { id: "test" }) {
        transaction { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "errors with a nonexistent id" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        transactionDelete(input: { id: "unknown" }) {
          transaction { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::NotFoundError
  end

  context "for an existing transaction" do
    let(:transaction) { create(:transaction) }

    it "deletes the transaction" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          transactionDelete(input: { id: "#{transaction.id}" }) {
            transaction { id }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["transactionDelete"]["transaction"]["id"]).to eq transaction.id
      expect(transaction.reload).to be_deleted
    end
  end
end
