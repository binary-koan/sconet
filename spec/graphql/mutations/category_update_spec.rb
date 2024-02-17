require 'rails_helper'

describe Mutations::CategoryUpdate do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        categoryUpdate(input: { id: "test", categoryInput: { name: "Test" } }) {
          category { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "errors with a nonexistent id" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        categoryUpdate(input: { id: "unknown", categoryInput: { name: "Test" } }) {
          category { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::NotFoundError
  end

  context "for an existing category" do
    let(:category) { create(:category) }
    let(:currency) { create(:currency) }

    it "updates the category" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          categoryUpdate(input: { id: "#{category.id}", categoryInput: { name: "Test2" } }) {
            category { id }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["categoryUpdate"]["category"]["id"]).to eq category.id
      expect(category.reload.name).to eq "Test2"
    end

    it "creates a budget" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          categoryUpdate(input: { id: "#{category.id}", categoryInput: { budgetCents: 1000, budgetCurrencyId: "#{currency.id}" } }) {
            category {
              id
              budgets { id }
            }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["categoryUpdate"]["category"]["budgets"].sole["id"]).to eq category.category_budgets.sole.id
      expect(category.category_budgets.sole).to have_attributes(
        date_from: Time.zone.now.beginning_of_month,
        date_to: nil,
        budget_cents: 1000,
        currency:
      )
    end

    context "when a budget exists" do
      let!(:existing_budget) { create(:category_budget, category:, date_to: nil) }

      it "end-dates the budget and creates a new one" do
        execute_graphql current_user:, query_string: <<~GRAPHQL
          mutation {
            categoryUpdate(input: { id: "#{category.id}", categoryInput: { budgetCents: 999, budgetCurrencyId: "#{currency.id}" } }) {
              category {
                id
                budgets { id }
              }
            }
          }
        GRAPHQL

        expect_graphql_success
        expect(graphql_data["categoryUpdate"]["category"]["budgets"].pluck("id")).to eq [
          existing_budget.id,
          category.category_budgets.last.id
        ]
        expect(existing_budget.reload.date_to).to eq Time.zone.now.beginning_of_month
        expect(category.category_budgets.last).to have_attributes(
          date_from: Time.zone.now.beginning_of_month,
          date_to: nil,
          budget_cents: 999,
          currency:
        )
      end
    end
  end
end
