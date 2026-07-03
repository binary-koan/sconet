require 'rails_helper'

describe "API key mutations" do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  describe Mutations::ApiKeyCreate do
    it "requires authentication" do
      execute_graphql query_string: <<~GRAPHQL
        mutation {
          apiKeyCreate(input: { name: "Test" }) {
            apiKey { id }
          }
        }
      GRAPHQL

      expect_graphql_error GraphqlErrors::UnauthorizedError
    end

    it "creates an API key and returns the token once" do
      expect do
        execute_graphql current_user:, query_string: <<~GRAPHQL
          mutation {
            apiKeyCreate(input: { name: "Test" }) {
              apiKey { id name token tokenPrefix disabledAt }
            }
          }
        GRAPHQL
        expect_graphql_success
      end.to change(ApiKey, :count).by(1)

      api_key = graphql_data["apiKeyCreate"]["apiKey"]
      expect(api_key["name"]).to eq "Test"
      expect(api_key["token"]).to start_with ApiKey::TOKEN_PREFIX
      expect(api_key["tokenPrefix"]).to eq api_key["token"].first(15)
      expect(api_key["disabledAt"]).to be_nil

      # Token is stored hashed and authenticates the user
      expect(ApiKey.find(api_key["id"]).token_digest).not_to include api_key["token"]
      expect(ApiKey.authenticate(api_key["token"])).to eq current_user
    end
  end

  describe Mutations::ApiKeyRegenerate do
    it "replaces the token, invalidating the old one" do
      api_key = create(:api_key, user: current_user)
      old_token = api_key.token

      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          apiKeyRegenerate(input: { id: "#{api_key.id}" }) {
            apiKey { token }
          }
        }
      GRAPHQL
      expect_graphql_success

      new_token = graphql_data["apiKeyRegenerate"]["apiKey"]["token"]
      expect(new_token).not_to eq old_token
      expect(ApiKey.authenticate(old_token)).to be_nil
      expect(ApiKey.authenticate(new_token)).to eq current_user
    end

    it "cannot regenerate another user's key" do
      api_key = create(:api_key)

      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          apiKeyRegenerate(input: { id: "#{api_key.id}" }) {
            apiKey { token }
          }
        }
      GRAPHQL

      expect(@graphql_result["errors"]).to be_present
    end
  end

  describe Mutations::ApiKeySetDisabled do
    it "disables and re-enables a key" do
      api_key = create(:api_key, user: current_user)
      token = api_key.token

      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          apiKeySetDisabled(input: { id: "#{api_key.id}", disabled: true }) {
            apiKey { disabledAt }
          }
        }
      GRAPHQL
      expect_graphql_success

      expect(graphql_data["apiKeySetDisabled"]["apiKey"]["disabledAt"]).to be_present
      expect(ApiKey.authenticate(token)).to be_nil

      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          apiKeySetDisabled(input: { id: "#{api_key.id}", disabled: false }) {
            apiKey { disabledAt }
          }
        }
      GRAPHQL
      expect_graphql_success

      expect(graphql_data["apiKeySetDisabled"]["apiKey"]["disabledAt"]).to be_nil
      expect(ApiKey.authenticate(token)).to eq current_user
    end
  end
end
