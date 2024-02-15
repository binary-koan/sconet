require 'rails_helper'

describe Resolvers::CurrentUserResolver do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      query {
        categories { id }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "returns the current user" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        currentUser {
          id
          email
          defaultCurrency { id }
          favouriteCurrencies { id }
          defaultAccount { id }
          createdAt
          updatedAt
          registeredCredentials { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["currentUser"]).to eq(
      "id" => current_user.id,
      "email" => current_user.email,
      "defaultCurrency" => nil,
      "favouriteCurrencies" => [],
      "defaultAccount" => nil,
      "createdAt" => current_user.created_at.iso8601,
      "updatedAt" => current_user.updated_at.iso8601,
      "registeredCredentials" => [],
    )
  end

  context "for a user with a bunch of stuff" do
    let!(:currency_favourite) { create(:user_currency_favourite, user: current_user) }
    let!(:credential) { create(:user_credential, user: current_user) }
    let(:currency) { create(:currency) }
    let(:account) { create(:account) }

    before do
      current_user.update!(default_currency: currency, default_account: account)
    end

    it "returns the stuff" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        query {
          currentUser {
            id
            email
            defaultCurrency { id }
            favouriteCurrencies { id }
            defaultAccount { id }
            createdAt
            updatedAt
            registeredCredentials { id }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["currentUser"]).to eq(
        "id" => current_user.id,
        "email" => current_user.email,
        "defaultCurrency" => { "id" => currency.id },
        "favouriteCurrencies" => [{ "id" => currency_favourite.currency.id }],
        "defaultAccount" => { "id" => account.id },
        "createdAt" => current_user.created_at.iso8601,
        "updatedAt" => current_user.updated_at.iso8601,
        "registeredCredentials" => [{ "id" => credential.id }],
      )
    end
  end
end
