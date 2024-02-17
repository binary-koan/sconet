require 'rails_helper'

describe Resolvers::AccountResolver do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  it "requires authentication" do
    execute_graphql variables: { id: "unknown" }, query_string: <<~GRAPHQL
      query($id: ID!) {
        account(id: $id) {
          id
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "returns nil for an invalid id" do
    execute_graphql current_user:, variables: { id: "invalid" }, query_string: <<~GRAPHQL
      query($id: ID!) {
        account(id: $id) {
          id
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["account"]).to be_nil
  end

  context "for an existing account" do
    let(:account) { create(:account) }

    it "returns fields" do
      execute_graphql current_user:, variables: { id: account.id }, query_string: <<~GRAPHQL
        query($id: ID!) {
          account(id: $id) {
            id
            name
            currency { id }
            createdAt
            updatedAt
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["account"]).to eq(
        "createdAt" => account.created_at.iso8601,
        "currency" => { "id" => account.currency.id },
        "id" => account.id,
        "name" => account.name,
        "updatedAt" => account.updated_at.iso8601,
      )
    end
  end
end
