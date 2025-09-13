# frozen_string_literal: true

module Mutations
  class AccountCreate < BaseMutation
    authenticated

    description "Creates a new account"

    field :account, Types::AccountType, null: false

    argument :account_input, Types::AccountInputType, required: true

    def resolve(account_input:)
      account = ::Account.new(**account_input, sort_order: ::Account.maximum(:sort_order).to_i + 1)
      raise GraphQL::ExecutionError.new "Error creating account", extensions: account.errors.to_hash unless account.save

      { account: account }
    end
  end
end
