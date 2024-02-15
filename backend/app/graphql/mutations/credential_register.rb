# frozen_string_literal: true

module Mutations
  class CredentialRegister < BaseMutation
    authenticated

    field :current_user, Types::CurrentUserType, null: false

    argument :response, GraphQL::Types::JSON, required: true
    argument :device, String, required: true

    def resolve(response:, device:)
      webauthn_credential = WebAuthn::Credential.from_create(response)

      webauthn_credential.verify(current_user.webauthn_challenge)

      current_user.user_credentials.create!(
        credential_id: webauthn_credential.id,
        credential_public_key: webauthn_credential.public_key,
        counter: webauthn_credential.sign_count,
        device:
      )

      { current_user: }
    end
  end
end
