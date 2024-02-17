require 'rails_helper'

describe Resolvers::TransactionsByDayResolver do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  let(:category) { create(:category) }
  let!(:transaction1) { create(:transaction, category:, shop: "First Shop", date: "2020-05-01", amount_cents: -300) }
  let!(:transaction2) { create(:transaction, date: "2020-05-03", amount_cents: -400) }
  let!(:transaction3) { create(:transaction, date: "2020-05-03", amount_cents: -100) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      query {
        transactionsByDay(dateFrom: "2020-05-01", dateUntil: "2020-05-03") {
          date
          totalSpent { formatted }
          transactions { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "returns transactions" do
    expect(ExchangeRates::ConvertMoney).to receive(:new).with(
      [transaction1.amount], to_currency: Currency.first
    ).and_return -> { Monies.new([Money.new(amount_cents: -300, currency: Currency.first)], Currency.first) }

    expect(ExchangeRates::ConvertMoney).to receive(:new).with(
      [], to_currency: Currency.first
    ).and_return -> { Monies.new([], Currency.first) }

    expect(ExchangeRates::ConvertMoney).to receive(:new).with(
      [transaction2.amount, transaction3.amount], to_currency: Currency.first
    ).and_return -> { Monies.new([Money.new(amount_cents: -500, currency: Currency.first)], Currency.first) }

    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        transactionsByDay(dateFrom: "2020-05-01", dateUntil: "2020-05-03") {
          date
          totalSpent { formatted }
          transactions { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["transactionsByDay"]).to eq [
      {
        "date" => "2020-05-01",
        "totalSpent" => { "formatted" => "-$3.00" },
        "transactions" => [
          { "id" => transaction1.id },
        ]
      },
      {
        "date" => "2020-05-02",
        "totalSpent" => { "formatted" => "$0.00" },
        "transactions" => []
      },
      {
        "date" => "2020-05-03",
        "totalSpent" => { "formatted" => "-$5.00" },
        "transactions" => [
          { "id" => transaction2.id },
          { "id" => transaction3.id },
        ]
      }
    ]
  end
end
