require 'rails_helper'

describe Mutations::CurrentUserUpdate do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }
  let(:currency) { create(:currency) }
  let(:account) { create(:account) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        currentUserUpdate(input: { userInput: {} }) {
          currentUser { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "updates the user" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        currentUserUpdate(input: { userInput: { email: "new@example.com", defaultCurrencyId: "#{currency.id}", defaultAccountId: "#{account.id}" } }) {
          currentUser {
            id
            email
            defaultCurrency { id }
            defaultAccount { id }
          }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["currentUserUpdate"]["currentUser"]).to eq(
      "id" => current_user.id,
      "email" => "new@example.com",
      "defaultCurrency" => { "id" => currency.id },
      "defaultAccount" => { "id" => account.id }
    )
  end

  it "updates the password" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        currentUserUpdate(input: { userInput: { oldPassword: "password", newPassword: "newpassword" } }) {
          currentUser { id }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(current_user.reload.authenticate("newpassword")).to be_truthy
  end

  it "fails with the wrong old password" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        currentUserUpdate(input: { userInput: { oldPassword: "wrong", newPassword: "newpassword" } }) {
          currentUser { id }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::AuthenticationFailedError
    expect(current_user.reload.authenticate("newpassword")).to be_falsy
  end
end
