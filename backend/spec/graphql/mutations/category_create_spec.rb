require 'rails_helper'

describe Mutations::CategoryCreate do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }
  let(:currency) { create(:currency) }

  it "requires authentication" do
    execute_graphql variables: { id: "unknown" }, query_string: <<~GRAPHQL
      mutation {
        categoryCreate(input: { categoryInput: { name: "Test" } }) {
          category { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "creates a category" do
    expect do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          categoryCreate(input: { categoryInput: { name: "Test", color: "red", icon: "Alarm" } }) {
            category { id }
          }
        }
      GRAPHQL
      expect_graphql_success
    end.to change(Category, :count).by(1)

    expect(Category.find(graphql_data["categoryCreate"]["category"]["id"])).to have_attributes(
      name: "Test",
      color: "red",
      icon: "Alarm"
    )
  end

  it "creates a budget" do
    expect do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          categoryCreate(input: { categoryInput: { name: "Test", color: "red", icon: "Alarm", budgetCents: 1000, budgetCurrencyId: "#{currency.id}" } }) {
            category {
              id
              budgets { id }
            }
          }
        }
      GRAPHQL
      expect_graphql_success
    end.to change(Category, :count).by(1)

    category = Category.find(graphql_data["categoryCreate"]["category"]["id"])
    expect(graphql_data["categoryCreate"]["category"]["budgets"].sole["id"]).to eq category.category_budgets.sole.id
    expect(category.category_budgets.sole).to have_attributes(
      date_from: Time.zone.now.beginning_of_month,
      date_to: nil,
      budget_cents: 1000,
      currency:
    )
  end
end
