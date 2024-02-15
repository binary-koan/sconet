require 'rails_helper'

describe Mutations::CredentialLoginStart do
  include GraphqlSpecHelpers

  let(:user) { create(:user, email: "test@example.com") }

  before do
    create(:user_credential, user: user, credential_id: "credential_id")
  end

  it "generates webauthn options" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        credentialLoginStart(input: { email: "#{user.email}" }) {
          options
        }
      }
    GRAPHQL

    expect_graphql_success
    expect(graphql_data["credentialLoginStart"]["options"]).to eq(
      challenge: user.reload.webauthn_challenge,
      timeout: 120000,
      extensions: {},
      allowCredentials: [{
        "type" => "public-key",
        "id" => "credential_id",
      }]
    )
  end
end
