require 'rails_helper'

describe Mutations::AccountDelete do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        accountDelete(input: { id: "test" }) {
          account { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "errors with a nonexistent id" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        accountDelete(input: { id: "unknown" }) {
          account { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::NotFoundError
  end

  context "for an existing account" do
    let(:account) { create(:account) }

    it "deletes the account" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          accountDelete(input: { id: "#{account.id}" }) {
            account { id }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["accountDelete"]["account"]["id"]).to eq account.id
      expect(account.reload).to be_deleted
    end
  end
end
