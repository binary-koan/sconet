# frozen_string_literal: true

module Mutations
  class ApiKeyCreate < BaseMutation
    authenticated

    description "Creates a new API key. The token is only returned once."

    field :api_key, Types::ApiKeyType, null: false

    argument :name, String, required: true

    def resolve(name:)
      api_key = current_user.api_keys.new(name: name)
      raise GraphQL::ExecutionError.new "Error creating API key", extensions: api_key.errors.to_hash unless api_key.save

      { api_key: api_key }
    end
  end
end
