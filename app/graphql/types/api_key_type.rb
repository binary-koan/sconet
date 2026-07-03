# frozen_string_literal: true

module Types
  class ApiKeyType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :token_prefix, String, null: false
    # Only present in the response that created or regenerated the key
    field :token, String, null: true
    field :disabled_at, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
