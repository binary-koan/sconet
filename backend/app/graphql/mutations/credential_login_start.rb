# frozen_string_literal: true

module Mutations
  class CredentialLoginStart < BaseMutation
    field :options, GraphQL::Types::JSON, null: false

    argument :email, String, required: true

    def resolve(email:)
      user = User.find_by!(email:)
      options = WebAuthn::Credential.options_for_get(allow: user.user_credentials.map(&:credential_id))

      user.update!(webauthn_challenge: options.challenge)

      { options: options.as_json }
    end
  end
end
