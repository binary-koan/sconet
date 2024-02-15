require 'rails_helper'

describe Mutations::Login do
  include GraphqlSpecHelpers

  let(:user) do
    create(
      :user,
      password: "password",
      webauthn_challenge: "Rcd4sstb1ElLn0QYjczYhLkPIG2hk3sr9X0_SHGA0Y8ZbTpIr7jllB0D0iF6GdUQ-CcYSjIHJZG27P0anokABA",
      user_credentials: [create(
        :user_credential,
        credential_id: "7KgYAmRHYqgeWq7SCOnjLTQ9M7U",
        credential_public_key: "pQECAyYgASFYIPxeiTzJ5HMGgHUTVIsrNbuiOwqBqWpW5qSa7vU4PQJFIlgg98O8lJrS7p0z4wJ92eaGsAL5N4NhBF1FZ8MOr2ndqZE"
      )]
    )
  end

  it "logs in via password" do
    execute_graphql variables: { email: user.email, password: "password" }, query_string: <<~GRAPHQL
      mutation($email: String!, $password: String!) {
        login(input: { email: $email, password: $password }) {
          token
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(JWT.decode(graphql_data["login"]["token"], nil, false).first).to include("user_id" => user.id)
  end

  it "fails with an invalid password" do
    execute_graphql variables: { email: user.email, password: "wrong" }, query_string: <<~GRAPHQL
      mutation($email: String!, $password: String!) {
        login(input: { email: $email, password: $password }) {
          token
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::AuthenticationFailedError
  end

  it "logs in via webauthn" do
    response = JSON.parse(File.read(Rails.root.join("spec", "fixtures", "webauthn_login_response.json")))

    execute_graphql variables: { webauthnResponse: response, email: user.email }, query_string: <<~GRAPHQL
      mutation($webauthnResponse: JSON!, $email: String!) {
        login(input: { webauthnResponse: $webauthnResponse, email: $email }) {
          token
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(JWT.decode(graphql_data["login"]["token"], nil, false).first).to include("user_id" => user.id)
  end
end
