# frozen_string_literal: true

module Mutations
  class AccountUpdate < BaseMutation
    authenticated

    description "Updates a account by id"

    field :account, Types::AccountType, null: false

    argument :id, ID, required: true
    argument :account_input, Types::AccountInputType, required: true

    def resolve(id:, account_input:)
      account = ::Account.find(id)
      raise GraphQL::ExecutionError.new "Error updating account", extensions: account.errors.to_hash unless account.update(**account_input)

      { account: account }
    end
  end
end
