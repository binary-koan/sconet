require 'rails_helper'

describe Resolvers::BudgetResolver do
  include GraphqlSpecHelpers

  let(:currency) { create(:currency) }
  let(:current_user) { create(:user, default_currency: currency) }

  let(:regular_category) { create(:category, regular: true) }
  let(:irregular_category) { create(:category, regular: false) }
  let!(:transaction1) { create(:transaction, currency:, date: "2022-05-01", amount_cents: 1000) }
  let!(:transaction2) { create(:transaction, currency:, category: irregular_category, date: "2022-05-31", amount_cents: -500) }
  let!(:transaction3) { create(:transaction, currency:, category: regular_category, date: "2022-05-10", amount_cents: -300) }
  let!(:transaction4) { create(:transaction, currency:, category: regular_category, date: "2022-05-16", amount_cents: -100) }
  let!(:transaction5) { create(:transaction, currency:, date: "2022-05-16", amount_cents: -50) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      query {
        budget(year: 2022, month: 5) { id }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "returns budget usage split by categories" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        budget(year: 2022, month: 5) {
          id
          month
          year
          income { formatted }
          totalSpending { formatted }
          difference { formatted }
          regularCategories {
            totalSpending { formatted }
            categories {
              id
              category { id }
              amountSpent { formatted }
            }
          }
          irregularCategories {
            totalSpending { formatted }
            categories {
              id
              category { id }
              amountSpent { formatted }
            }
          }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["budget"]).to eq(
      "id" => "2022-5",
      "month" => 5,
      "year" => 2022,
      "income" => { "formatted" => "$10.00" },
      "totalSpending" => { "formatted" => "$9.50" },
      "difference" => { "formatted" => "$0.50" },
      "regularCategories" => {
        "totalSpending" => { "formatted" => "$4.00" },
        "categories" => [{
          "id" => "2022-5-#{regular_category.id}",
          "category" => { "id" => regular_category.id },
          "amountSpent" => { "formatted" => "$4.00" }
        }]
      },
      "irregularCategories" => {
        "totalSpending" => { "formatted" => "$5.50" },
        "categories" => [{
          "id" => "2022-5-uncategorized",
          "category" => nil,
          "amountSpent" => { "formatted" => "$0.50" }
        }, {
          "id" => "2022-5-#{irregular_category.id}",
          "category" => { "id" => irregular_category.id },
          "amountSpent" => { "formatted" => "$5.00" }
        }]
      }
    )
  end
end
