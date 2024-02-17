require 'rails_helper'

describe Mutations::CredentialDelete do
  include GraphqlSpecHelpers

  let(:current_user) { create(:user) }

  it "requires authentication" do
    execute_graphql query_string: <<~GRAPHQL
      mutation {
        credentialDelete(input: { id: "test" }) {
          currentUser {
            registeredCredentials { id }
          }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::UnauthorizedError
  end

  it "errors with a nonexistent id" do
    execute_graphql current_user:, query_string: <<~GRAPHQL
      mutation {
        credentialDelete(input: { id: "unknown" }) {
          currentUser {
            registeredCredentials { id }
          }
        }
      }
    GRAPHQL

    expect_graphql_error GraphqlErrors::NotFoundError
  end

  context "for an existing credential" do
    let(:credential) { create(:user_credential, user: current_user) }

    it "deletes the credential" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          credentialDelete(input: { id: "#{credential.id}" }) {
            currentUser {
              registeredCredentials { id }
            }
          }
        }
      GRAPHQL

      expect_graphql_success
      expect(graphql_data["credentialDelete"]["currentUser"]["registeredCredentials"]).to eq []
      expect(credential.reload).to be_deleted
    end
  end

  context "when the credential belongs to a different user" do
    let(:credential) { create(:user_credential) }

    it "errors" do
      execute_graphql current_user:, query_string: <<~GRAPHQL
        mutation {
          credentialDelete(input: { id: "#{credential.id}" }) {
            currentUser {
              registeredCredentials { id }
            }
          }
        }
      GRAPHQL

      expect_graphql_error GraphqlErrors::NotFoundError
    end
  end
end
