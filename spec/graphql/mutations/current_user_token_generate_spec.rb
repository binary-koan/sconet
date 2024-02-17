require 'rails_helper'

describe Mutations::CurrentUserTokenGenerate do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        currentUserTokenGenerate(input: {}) {
          token
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "generates a token" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        currentUserTokenGenerate(input: {}) {
          token
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(JWT.decode(graphql_data["currentUserTokenGenerate"]["token"], nil, false).first).to include("user_id" => current_user.id)
  end
end
