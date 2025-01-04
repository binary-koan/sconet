module Resolvers
  class AccountsResolver < BaseResolver
    authenticated

    type [Types::AccountType], null: false

    def resolve
      ::Account.where(archived_at: nil).order(:name)
    end
  end
end
