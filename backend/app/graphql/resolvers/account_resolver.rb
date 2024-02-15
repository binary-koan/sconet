module Resolvers
  class AccountResolver < BaseResolver
    authenticated

    type Types::AccountType, null: true

    argument :id, ID, required: true

    def resolve(id:)
      ::Account.find_by(id:)
    end
  end
end
