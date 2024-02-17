# frozen_string_literal: true

module Mutations
  class AccountDelete < BaseMutation
    authenticated

    description "Deletes a account by ID"

    field :account, Types::AccountType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      account = ::Account.find(id)
      account.transaction do
        account.mark_deleted!
        account.transactions.each(&:mark_deleted!)
      end

      { account: account }
    end
  end
end
