require 'rails_helper'

describe Mutations::TransactionSplit do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }
  let(:currency) { create(:currency) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        transactionSplit(input: { id: "test", splits: [{ amountCents: 200, memo: "test" }] }) {
          transaction { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "errors with a nonexistent id" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        transactionSplit(input: { id: "unknown", splits: [{ amountCents: 200, memo: "test" }] }) {
          transaction { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::NotFoundError
  end

  context "for an existing transaction" do
    let(:transaction) { create(:transaction, shop: "Parent Shop", amount_cents: -1000) }
    let(:category) { create(:category) }

    it "errors when the split amount does not match" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          transactionSplit(input: { id: "#{transaction.id}", splits: [{ amountCents: -200, memo: "test" }] }) {
            transaction { id }
          }
        }
      GRAPHQL

      expect_graphql_error GraphqlErrors::ValidationError
    end

    it "creates splits" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          transactionSplit(input: { id: "#{transaction.id}", splits: [{ amountCents: -200, memo: "test" }, { amountCents: -800, memo: "test2", categoryId: "#{category.id}" }] }) {
            transaction { id }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["transactionSplit"]["transaction"]["id"]).to eq transaction.id
      expect(transaction.reload.split_to).to contain_exactly(
        an_object_having_attributes(shop: "Parent Shop", amount_cents: -200, memo: "test"),
        an_object_having_attributes(shop: "Parent Shop", amount_cents: -800, memo: "test2", category:)
      )
    end
  end
end
