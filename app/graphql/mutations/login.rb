# frozen_string_literal: true

module Mutations
  class Login < BaseMutation
    field :user, Types::CurrentUserType, null: false

    argument :email, String, required: true

    argument :password, String, required: false
    argument :webauthn_response, GraphQL::Types::JSON, required: false

    def resolve(email:, password: nil, webauthn_response: nil)
      user = User.find_by!(email: email)

      authenticate!(user:, password:, webauthn_response:)

      { user: }
    end

    private

    def authenticate!(user:, password:, webauthn_response:)
      if password.present?
        raise GraphqlErrors::AuthenticationFailedError, "Invalid email or password" unless user.authenticate(password)
      elsif webauthn_response.present?
        webauthn_credential = WebAuthn::Credential.from_get(webauthn_response)
        stored_credential = UserCredential.find_by!(credential_id: webauthn_credential.id)
        webauthn_credential.verify(
          stored_credential.user.webauthn_challenge,
          public_key: stored_credential.credential_public_key,
          sign_count: stored_credential.counter
        )
        stored_credential.update!(counter: webauthn_credential.sign_count)
      else
        raise GraphqlErrors::AuthenticationFailedError, "Missing credentials"
      end
    end
  end
end
