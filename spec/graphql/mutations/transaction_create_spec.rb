require 'rails_helper'

describe Mutations::TransactionCreate do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }
  let(:currency) { create(:currency) }
  let(:account) { create(:account) }

  it "requires authentication" do
    execute_graphql variables: { id: "unknown" }, query_string: <<~GRAPHQL
      mutation {
        transactionCreate(input: { transactionInput: { shop: "Test", amountCents: -1000, currencyId: "#{currency.id}" } }) {
          transaction { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "creates an transaction" do
    expect do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          transactionCreate(input: { transactionInput: { accountId: "#{account.id}", date: "#{Date.today.iso8601}", shop: "Test", amountCents: -1000, currencyId: "#{currency.id}" } }) {
            transaction { id }
          }
        }
      GRAPHQL
      expect_graphql_success
    end.to change(Transaction, :count).by(1)

    expect(Transaction.find(graphql_data["transactionCreate"]["transaction"]["id"])).to have_attributes(
      shop: "Test",
      amount_cents: -1000,
      currency:
    )
  end

  context "when a transaction with the same amount, currency, and date exists" do
    let!(:existing) { create(:transaction, account:, currency:, shop: "Elsewhere", date: Date.today, amount_cents: -1000) }

    def create_duplicate(arguments = "")
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          transactionCreate(input: { #{arguments} transactionInput: { accountId: "#{account.id}", date: "#{Date.today.iso8601}", shop: "Test", amountCents: -1000, currencyId: "#{currency.id}" } }) {
            transaction { id }
          }
        }
      GRAPHQL
    end

    it "fails with DUPLICATE_TRANSACTION" do
      expect { create_duplicate }.not_to change(Transaction, :count)

      expect(graphql_errors.first["extensions"]["code"]).to eq("DUPLICATE_TRANSACTION")
    end

    it "creates the transaction when allowDuplicate is true" do
      expect do
        create_duplicate "allowDuplicate: true,"
        expect_graphql_success
      end.to change(Transaction, :count).by(1)
    end
  end
end
