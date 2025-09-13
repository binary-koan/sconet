module Resolvers
  class FavouriteTransactionsResolver < BaseResolver
    authenticated

    type [Types::FavouriteTransactionType], null: false

    def resolve
      current_user.favourite_transactions.order(:name)
    end
  end
end


