require 'rails_helper'

describe Mutations::AccountUpdate do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }
  let(:currency) { create(:currency) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        accountUpdate(input: { id: "test", accountInput: { name: "Test", currencyId: "#{currency.id}" } }) {
          account { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "errors with a nonexistent id" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        accountUpdate(input: { id: "unknown", accountInput: { name: "Test", currencyId: "#{currency.id}" } }) {
          account { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::NotFoundError
  end

  context "for an existing account" do
    let(:account) { create(:account) }

    it "updates the account" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          accountUpdate(input: { id: "#{account.id}", accountInput: { name: "Test2" } }) {
            account { id }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["accountUpdate"]["account"]["id"]).to eq account.id
      expect(account.reload.name).to eq "Test2"
    end
  end
end
