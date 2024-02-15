require 'rails_helper'

describe Mutations::CategoryDelete do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        categoryDelete(input: { id: "test" }) {
          category { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "errors with a nonexistent id" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        categoryDelete(input: { id: "unknown" }) {
          category { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::NotFoundError
  end

  context "for an existing category" do
    let(:category) { create(:category) }

    it "deletes the category" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          categoryDelete(input: { id: "#{category.id}" }) {
            category { id }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["categoryDelete"]["category"]["id"]).to eq category.id
      expect(category.reload).to be_deleted
    end
  end
end
