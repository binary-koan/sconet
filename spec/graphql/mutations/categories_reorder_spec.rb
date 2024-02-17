require 'rails_helper'

describe Mutations::CategoriesReorder do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  let!(:category1) { create(:category, sort_order: 1) }
  let!(:category2) { create(:category, sort_order: 2) }
  let!(:category3) { create(:category, sort_order: 3) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        categoriesReorder(input: { orderedIds: ["unknown"] }) {
          categories { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "raises an error when not all category ids are specified" do
    execute_graphql current_user: current_user, query_string: <<~GRAPHQL
      mutation {
        categoriesReorder(input: { orderedIds: ["#{category1.id}"] }) {
          categories { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::ValidationError
  end

  it "reorders the categories" do
    execute_graphql current_user: current_user, query_string: <<~GRAPHQL
      mutation {
        categoriesReorder(input: { orderedIds: ["#{category3.id}", "#{category1.id}", "#{category2.id}"] }) {
          categories { id }
        }
      }
    GRAPHQL

    expect(graphql_data["categoriesReorder"]["categories"].pluck("id")).to eq([category3.id, category1.id, category2.id])
    expect(category1.reload.sort_order).to eq(2)
    expect(category2.reload.sort_order).to eq(3)
    expect(category3.reload.sort_order).to eq(1)
  end
end
