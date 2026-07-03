# frozen_string_literal: true

module Mutations
  class ApiKeyRegenerate < BaseMutation
    authenticated

    description "Replaces an API key's token. The old token stops working immediately and the new token is only returned once."

    field :api_key, Types::ApiKeyType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      api_key = current_user.api_keys.find(id)
      api_key.regenerate!

      { api_key: api_key }
    end
  end
end
