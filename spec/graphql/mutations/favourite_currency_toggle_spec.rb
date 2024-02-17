require 'rails_helper'

describe Mutations::CurrentUserTokenGenerate do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }
  let(:currency1) { create(:currency) }
  let(:currency2) { create(:currency) }

  before do
    create(:user_currency_favourite, user: current_user, currency: currency1)
  end

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        favouriteCurrencyToggle(input: { id: "#{currency2.id}", favourite: true }) {
          currentUser {
            favouriteCurrencies { id }
          }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "adds a favourite" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        favouriteCurrencyToggle(input: { id: "#{currency2.id}", favourite: true }) {
          currentUser {
            favouriteCurrencies { id }
          }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["favouriteCurrencyToggle"]["currentUser"]).to eq("favouriteCurrencies" => [
      { "id" => currency1.id },
      { "id" => currency2.id }
    ])
  end

  it "removes a favourite" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        favouriteCurrencyToggle(input: { id: "#{currency1.id}", favourite: false }) {
          currentUser {
            favouriteCurrencies { id }
          }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["favouriteCurrencyToggle"]["currentUser"]).to eq("favouriteCurrencies" => [])
  end
end
