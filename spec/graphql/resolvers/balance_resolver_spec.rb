require 'rails_helper'

describe Resolvers::BalanceResolver do
  include GraphqlSpecHelpers

  let(:currency) { create(:currency) }
  let(:current_user) { create(:user, default_currency: currency) }

  let!(:transaction1) { create(:transaction, currency:, date: "2022-05-01", amount_cents: 1000) }
  let!(:transaction2) { create(:transaction, currency:, date: "2022-05-31", amount_cents: -500) }
  let!(:transaction3) { create(:transaction, currency:, date: "2022-07-10", amount_cents: -300) }

  def empty_month(number)
    {
      "id" => "2022-#{number}",
      "month" => number,
      "year" => 2022,
      "income" => { "formatted" => "$0.00" },
      "totalSpending" => { "formatted" => "$0.00" },
      "difference" => { "formatted" => "$0.00" }
    }
  end

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      query {
        balance(year: 2022) { id }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "returns annual balance split by month" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      query {
        balance(year: 2022) {
          id
          year
          currency { id }
          income { formatted }
          totalSpending { formatted }
          difference { formatted }
          months {
            id
            month
            year
            income { formatted }
            totalSpending { formatted }
            difference { formatted }
          }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["balance"]).to eq(
      "id" => "2022",
      "year" => 2022,
      "currency" => { "id" => current_user.default_currency.id },
      "income" => { "formatted" => "$10.00" },
      "totalSpending" => { "formatted" => "$8.00" },
      "difference" => { "formatted" => "$2.00" },
      "months" => [
        empty_month(1),
        empty_month(2),
        empty_month(3),
        empty_month(4),
        {
          "id" => "2022-5",
          "month" => 5,
          "year" => 2022,
          "income" => { "formatted" => "$10.00" },
          "totalSpending" => { "formatted" => "$5.00" },
          "difference" => { "formatted" => "$5.00" }
        },
        empty_month(6),
        {
          "id" => "2022-7",
          "month" => 7,
          "year" => 2022,
          "income" => { "formatted" => "$0.00" },
          "totalSpending" => { "formatted" => "$3.00" },
          "difference" => { "formatted" => "-$3.00" }
        },
        empty_month(8),
        empty_month(9),
        empty_month(10),
        empty_month(11),
        empty_month(12)
      ]
    )
  end
end
