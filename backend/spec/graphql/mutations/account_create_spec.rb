require 'rails_helper'

describe Mutations::AccountCreate do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }
  let(:currency) { create(:currency) }

  it "requires authentication" do
    execute_graphql variables: { id: "unknown" }, query_string: <<~GRAPHQL
      mutation {
        accountCreate(input: { accountInput: { name: "Test", currencyId: "#{currency.id}" } }) {
          account { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "creates an account" do
    expect do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          accountCreate(input: { accountInput: { name: "Test", currencyId: "#{currency.id}" } }) {
            account { id }
          }
        }
      GRAPHQL
      expect_graphql_success
    end.to change(Account, :count).by(1)

    expect(Account.find(graphql_data["accountCreate"]["account"]["id"])).to have_attributes(
      name: "Test",
      currency:
    )
  end
end
