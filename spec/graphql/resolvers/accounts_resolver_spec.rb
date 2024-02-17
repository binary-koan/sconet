require 'rails_helper'

describe Resolvers::AccountsResolver do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  let!(:account1) { create(:account, name: "One Account") }
  let!(:account2) { create(:account, name: "Another Account") }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      query {
        accounts { id }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "returns sorted accounts" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        accounts { id }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["accounts"]).to eq [
      { "id" => account2.id },
      { "id" => account1.id },
    ]
  end
end
