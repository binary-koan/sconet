require 'rails_helper'

describe Resolvers::TransactionsResolver do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  let(:category) { create(:category) }
  let!(:transaction1) { create(:transaction, category:, shop: "First Shop", date: 2.days.ago, amount_cents: -300) }
  let!(:transaction2) { create(:transaction, date: 1.day.ago, amount_cents: -200) }
  let!(:transaction3) { create(:transaction, date: 1.day.ago, amount_cents: -100) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      query {
        transactions {
          nodes { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "returns sorted transactions" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        transactions {
          nodes { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transactions"]).to eq(
      "nodes" => [
        { "id" => transaction2.id },
        { "id" => transaction3.id },
        { "id" => transaction1.id },
      ]
    )
  end

  it "supports limiting the results" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        transactions(first: 2) {
          nodes { id }
          pageInfo { endCursor }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transactions"]).to include(
      "nodes" => [
        { "id" => transaction2.id },
        { "id" => transaction3.id },
      ]
    )

    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        transactions(after: "#{graphql_data.dig("transactions", "pageInfo", "endCursor")}") {
          nodes { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transactions"]).to eq(
      "nodes" => [
        { "id" => transaction1.id },
      ]
    )
  end

  it "supports filtering by keyword" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        transactions(filter: { keyword: "first" }) {
          nodes { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transactions"]).to eq(
      "nodes" => [
        { "id" => transaction1.id },
      ]
    )
  end

  it "supports filtering by date" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        transactions(filter: { dateFrom: "#{transaction2.date}", dateUntil: "#{transaction2.date}" }) {
          nodes { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transactions"]).to eq(
      "nodes" => [
        { "id" => transaction2.id },
        { "id" => transaction3.id },
      ]
    )
  end

  it "supports filtering by amount" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        transactions(filter: { minAmountCents: #{transaction2.amount_cents}, maxAmountCents: #{transaction2.amount_cents} }) {
          nodes { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transactions"]).to eq(
      "nodes" => [
        { "id" => transaction2.id },
      ]
    )

    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        transactions(filter: { minAmountCents: #{transaction2.amount_cents} }) {
          nodes { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transactions"]).to eq(
      "nodes" => [
        { "id" => transaction2.id },
        { "id" => transaction3.id },
      ]
    )

    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        transactions(filter: { maxAmountCents: #{transaction2.amount_cents} }) {
          nodes { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transactions"]).to eq(
      "nodes" => [
        { "id" => transaction2.id },
        { "id" => transaction1.id },
      ]
    )
  end

  it "supports filtering by category" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        transactions(filter: { categoryIds: ["#{category.id}"] }) {
          nodes { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transactions"]).to eq(
      "nodes" => [
        { "id" => transaction1.id },
      ]
    )

    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        transactions(filter: { categoryIds: [null] }) {
          nodes { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transactions"]).to eq(
      "nodes" => [
        { "id" => transaction2.id },
        { "id" => transaction3.id },
      ]
    )

    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        transactions(filter: { categoryIds: ["#{category.id}", null] }) {
          nodes { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transactions"]).to eq(
      "nodes" => [
        { "id" => transaction2.id },
        { "id" => transaction3.id },
        { "id" => transaction1.id },
      ]
    )
  end
end
