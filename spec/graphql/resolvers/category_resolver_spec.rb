require 'rails_helper'

describe Resolvers::CategoryResolver do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  it "requires authentication" do
    execute_graphql variables: { id: "unknown" }, query_string: <<~GRAPHQL
      query($id: ID!) {
        category(id: $id) {
          id
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "returns nil for an invalid id" do
    execute_graphql current_user:, variables: { id: "invalid" }, query_string: <<~GRAPHQL
      query($id: ID!) {
        category(id: $id) {
          id
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["category"]).to be_nil
  end

  context "for an existing category" do
    let(:category) { create(:category) }

    it "returns fields" do
      execute_graphql current_user:, variables: { id: category.id }, query_string: <<~GRAPHQL
        query($id: ID!) {
          category(id: $id) {
            id
            name
            color
            icon
            sortOrder
            isRegular
            createdAt
            updatedAt
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["category"]).to eq(
        "color" => category.color,
        "createdAt" => category.created_at.iso8601,
        "icon" => category.icon,
        "id" => category.id,
        "isRegular" => category.regular?,
        "name" => category.name,
        "sortOrder" => category.sort_order,
        "updatedAt" => category.updated_at.iso8601,
      )
    end
  end

  context "for a category with budgets" do
    let(:category) { create(:category) }
    let!(:budget1) { create(:category_budget, category:, date_from: Date.new(2020, 1, 1), date_to: Date.new(2020, 1, 31), budget_cents: 999) }
    let!(:budget2) { create(:category_budget, category:, date_from: Date.new(2020, 2, 1), date_to: Date.new(2020, 2, 29), budget_cents: 799) }

    it "returns fields" do
      execute_graphql current_user:, variables: { id: category.id }, query_string: <<~GRAPHQL
        query($id: ID!) {
          category(id: $id) {
            budgets {
              id
              dateFrom
              dateTo
              budget { formatted }
              currency { id }
              createdAt
              updatedAt
            }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["category"]).to eq(
        "budgets" => [
          {
            "budget" => { "formatted" => "$9.99" },
            "createdAt" => budget1.created_at.iso8601,
            "currency" => { "id" => budget1.currency.id },
            "dateFrom" => budget1.date_from.iso8601,
            "dateTo" => budget1.date_to.iso8601,
            "id" => budget1.id,
            "updatedAt" => budget1.updated_at.iso8601,
          },
          {
            "budget" => { "formatted" => "$7.99" },
            "createdAt" => budget2.created_at.iso8601,
            "currency" => { "id" => budget2.currency.id },
            "dateFrom" => budget2.date_from.iso8601,
            "dateTo" => budget2.date_to.iso8601,
            "id" => budget2.id,
            "updatedAt" => budget2.updated_at.iso8601,
          }
        ]
      )
    end

    it "returns the budget on a specific date" do
      expect(ExchangeRates::ConvertMoney).to receive(:new).with(
        [budget1.budget.on_date(Date.new(2020, 1, 15))],
        to_currency: budget2.currency
      ).and_return -> { [MoneyOnDate.new(date: Date.new(2020, 1, 15), currency: budget2.currency, amount_cents: 899)] }

      execute_graphql current_user:, variables: { id: category.id }, query_string: <<~GRAPHQL
        query($id: ID!) {
          category(id: $id) {
            budget(date: "2020-01-15") {
              id
              budget(date: "2020-01-15", currencyId: "#{budget2.currency.id}") { formatted }
            }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["category"]).to eq(
        "budget" => {
          "budget" => { "formatted" => "$8.99" },
          "id" => budget1.id
        }
      )
    end
  end
end
