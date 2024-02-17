require 'rails_helper'

describe Resolvers::CurrenciesResolver do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  let!(:currency1) { create(:currency, code: "DEF") }
  let!(:currency2) { create(:currency, code: "ABC") }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      query {
        currencies { id }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "returns sorted currencies" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        currencies { id }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["currencies"]).to eq [
      { "id" => currency2.id },
      { "id" => currency1.id },
    ]
  end
end
