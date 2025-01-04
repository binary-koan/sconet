# frozen_string_literal: true

module Mutations
  class AccountArchive < BaseMutation
    authenticated

    description "Archives a account by ID"

    field :account, Types::AccountType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      account = ::Account.find(id)
      account.update!(archived_at: Time.current)

      { account: account }
    end
  end
end
