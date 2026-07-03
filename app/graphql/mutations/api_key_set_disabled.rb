# frozen_string_literal: true

module Mutations
  class ApiKeySetDisabled < BaseMutation
    authenticated

    description "Disables or re-enables an API key"

    field :api_key, Types::ApiKeyType, null: false

    argument :id, ID, required: true
    argument :disabled, Boolean, required: true

    def resolve(id:, disabled:)
      api_key = current_user.api_keys.find(id)
      api_key.update!(disabled_at: disabled ? Time.current : nil)

      { api_key: api_key }
    end
  end
end
