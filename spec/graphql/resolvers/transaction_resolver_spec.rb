require 'rails_helper'

describe Resolvers::TransactionResolver do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  it "requires authentication" do
    execute_graphql variables: { id: "unknown" }, query_string: <<~GRAPHQL
      query($id: ID!) {
        transaction(id: $id) {
          id
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "returns nil for an invalid id" do
    execute_graphql current_user:, variables: { id: "invalid" }, query_string: <<~GRAPHQL
      query($id: ID!) {
        transaction(id: $id) {
          id
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transaction"]).to be_nil
  end

  context "for an empty transaction" do
    let(:transaction) { create(:transaction, shop: "Shop") }

    it "returns fields" do
      execute_graphql current_user:, variables: { id: transaction.id }, query_string: <<~GRAPHQL
        query($id: ID!) {
          transaction(id: $id) {
            id
            shop
            memo
            date
            includeInReports
            amount { formatted }
            currency { id }
            shopAmount { formatted }
            shopCurrency { id }
            category { id }
            account { id }
            splitFrom { id }
            splitTo { id }
            createdAt
            updatedAt
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["transaction"]).to eq(
        "account" => { "id" => transaction.account.id },
        "amount" => { "formatted" => "-$1.00" },
        "category" => nil,
        "createdAt" => transaction.created_at.iso8601,
        "currency" => { "id" => transaction.currency.id },
        "date" => transaction.date.iso8601,
        "id" => transaction.id,
        "includeInReports" => true,
        "memo" => "",
        "shop" => "Shop",
        "shopAmount" => nil,
        "shopCurrency" => nil,
        "splitFrom" => nil,
        "splitTo" => [],
        "updatedAt" => transaction.updated_at.iso8601,
      )
    end
  end

  context "for a complex transaction" do
    let(:category) { create(:category) }
    let(:currency) { create(:currency, symbol: '$') }
    let(:shop_currency) { create(:currency, symbol: '£') }
    let(:split_from) { create(:transaction) }
    let(:transaction) { create(:transaction, split_from:, shop: "Shop", memo: "Memo", category:, amount_cents: -100, currency:, shop_amount_cents: -90, shop_currency:) }

    it "returns fields" do
      execute_graphql current_user:, variables: { id: transaction.id }, query_string: <<~GRAPHQL
        query($id: ID!) {
          transaction(id: $id) {
            id
            shop
            memo
            date
            includeInReports
            amount { formatted }
            currency { id }
            shopAmount { formatted }
            shopCurrency { id }
            category { id }
            account { id }
            splitFrom { id }
            splitTo { id }
            createdAt
            updatedAt
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["transaction"]).to eq(
        "account" => { "id" => transaction.account.id },
        "amount" => { "formatted" => "-$1.00" },
        "category" => { "id" => category.id },
        "createdAt" => transaction.created_at.iso8601,
        "currency" => { "id" => currency.id },
        "date" => transaction.date.iso8601,
        "id" => transaction.id,
        "includeInReports" => true,
        "memo" => "Memo",
        "shop" => "Shop",
        "shopAmount" => { "formatted" => "-£0.90" },
        "shopCurrency" => { "id" => shop_currency.id },
        "splitFrom" => { "id" => split_from.id },
        "splitTo" => [],
        "updatedAt" => transaction.updated_at.iso8601,
      )
    end
  end

  context "for a split transaction" do
    let(:transaction) { create(:transaction) }
    let!(:split_to) { [create(:transaction, split_from: transaction), create(:transaction, split_from: transaction)] }

    it "returns fields" do
      execute_graphql current_user:, variables: { id: transaction.id }, query_string: <<~GRAPHQL
        query($id: ID!) {
          transaction(id: $id) {
            id
            splitTo { id }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["transaction"]).to eq(
        "id" => transaction.id,
        "splitTo" => [
          { "id" => split_to[0].id },
          { "id" => split_to[1].id },
        ],
      )
    end
  end
end
