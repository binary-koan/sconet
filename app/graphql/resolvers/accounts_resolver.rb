module Resolvers
  class AccountsResolver < BaseResolver
    authenticated

    type [Types::AccountType], null: false

    def resolve
      ::Account.order(:name)
    end
  end
end
