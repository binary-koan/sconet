require 'rails_helper'

describe Resolvers::CurrencyResolver do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  it "requires authentication" do
    execute_graphql variables: { id: "unknown" }, query_string: <<~GRAPHQL
      query($id: ID!) {
        currency(id: $id) {
          id
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "returns nil for an invalid id" do
    execute_graphql current_user:, variables: { id: "invalid" }, query_string: <<~GRAPHQL
      query($id: ID!) {
        currency(id: $id) {
          id
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["currency"]).to be_nil
  end

  context "for an existing currency" do
    let(:currency) { create(:currency) }
    let(:other_currency) { create(:currency) }

    it "returns fields" do
      expect(ExchangeRates::ConvertMoney).to receive(:new).with(
        [MoneyOnDate.new(date: Date.today, currency:, amount_cents: 100)],
        to_currency: other_currency
      ).and_return -> { [MoneyOnDate.new(date: Date.today, currency: other_currency, amount_cents: 200)] }

      execute_graphql current_user:, variables: { id: currency.id }, query_string: <<~GRAPHQL
        query($id: ID!) {
          currency(id: $id) {
            id
            code
            name
            symbol
            decimalDigits
            exchangeRate(to: "#{other_currency.id}")
            createdAt
            updatedAt
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["currency"]).to eq(
        "code" => currency.code,
        "createdAt" => currency.created_at.iso8601,
        "decimalDigits" => currency.decimal_digits,
        "id" => currency.id,
        "name" => currency.name,
        "symbol" => currency.symbol,
        "updatedAt" => currency.updated_at.iso8601,
        "exchangeRate" => 2.0,
      )
    end
  end
end
