# frozen_string_literal: true

module Mutations
  class CredentialRegistrationStart < BaseMutation
    authenticated

    field :options, GraphQL::Types::JSON, null: false

    def resolve
      options = WebAuthn::Credential.options_for_create(
        user: { id: current_user.id, name: current_user.email },
        exclude: current_user.user_credentials.map(&:credential_id)
      )

      current_user.update!(webauthn_challenge: options.challenge)

      { options: options.as_json }
    end
  end
end
