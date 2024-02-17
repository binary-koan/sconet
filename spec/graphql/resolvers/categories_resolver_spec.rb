require 'rails_helper'

describe Resolvers::CategoriesResolver do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  let!(:category1) { create(:category, name: "One Category", sort_order: 2) }
  let!(:category2) { create(:category, name: "Another Category", sort_order: 1) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      query {
        categories { id }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "returns sorted categories" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        categories { id }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["categories"]).to eq [
      { "id" => category2.id },
      { "id" => category1.id },
    ]
  end
end
