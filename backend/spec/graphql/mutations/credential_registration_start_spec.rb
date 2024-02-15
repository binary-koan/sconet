require 'rails_helper'

describe Mutations::CredentialRegistrationStart do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  before do
    create(:user_credential, user: current_user, credential_id: "credential_id")
  end

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        credentialRegistrationStart(input: {}) {
          options
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "generates webauthn options" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        credentialRegistrationStart(input: {}) {
          options
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["credentialRegistrationStart"]["options"]).to eq(
      challenge: current_user.reload.webauthn_challenge,
      timeout: 120000,
      extensions: {},
      rp: {},
      user: {
        name: current_user.email,
        id: current_user.id,
        displayName: current_user.email
      },
      pubKeyCredParams: [
        { "type" => "public-key", "alg" => -7 },
        { "type" => "public-key", "alg" => -37 },
        { "type" => "public-key", "alg" => -257 }
      ],
      excludeCredentials: [{
        "type" => "public-key",
        "id" => "credential_id",
      }]
    )
  end
end
