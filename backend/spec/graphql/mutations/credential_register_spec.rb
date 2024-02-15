require 'rails_helper'

describe Mutations::CredentialRegister do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user, webauthn_challenge: "8Ufsp8-4UJIxs3-s5Kj5ULyhjXPVesW-i9FRBUZxk665tFbruLYQIi37YhBPy9C5WBpzc9_9g1wBC39b9N3_eA==") }

  it "requires authentication" do
    execute_graphql variables: { response: {}, device: "test" }, query_string: <<~GRAPHQL
      mutation($response: JSON!, $device: String!) {
        credentialRegister(input: { response: $response, device: $device }) {
          currentUser {
            registeredCredentials { id }
          }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "registers a credential" do
    response = JSON.parse(File.read(Rails.root.join("spec", "fixtures", "webauthn_create_response.json")))

    execute_graphql current_user:, variables: { response:, device: "test" }, query_string: <<~GRAPHQL
      mutation($response: JSON!, $device: String!) {
        credentialRegister(input: { response: $response, device: $device }) {
          currentUser {
            registeredCredentials { id }
          }
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["credentialRegister"]["currentUser"]["registeredCredentials"]).to eq [
      { "id" => current_user.reload.user_credentials.sole.id }
    ]
    expect(current_user.user_credentials.sole).to have_attributes(
      device: "test",
      credential_id: "7KgYAmRHYqgeWq7SCOnjLTQ9M7U",
      credential_public_key: "pQECAyYgASFYIPxeiTzJ5HMGgHUTVIsrNbuiOwqBqWpW5qSa7vU4PQJFIlgg98O8lJrS7p0z4wJ92eaGsAL5N4NhBF1FZ8MOr2ndqZE",
      counter: 0
    )
  end
end
