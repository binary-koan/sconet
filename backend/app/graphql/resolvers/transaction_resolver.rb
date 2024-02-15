module Resolvers
  class TransactionResolver < BaseResolver
    authenticated

    type Types::TransactionType, null: true

    argument :id, ID, required: true

    def resolve(id:)
      ::Transaction.find_by(id:)
    end
  end
end
