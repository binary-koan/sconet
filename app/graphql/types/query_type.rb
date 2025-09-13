# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :accounts, resolver: Resolvers::AccountsResolver
    field :account, resolver: Resolvers::AccountResolver
    field :balance, resolver: Resolvers::BalanceResolver
    field :budget, resolver: Resolvers::BudgetResolver
    field :categories, resolver: Resolvers::CategoriesResolver
    field :category, resolver: Resolvers::CategoryResolver
    field :currencies, resolver: Resolvers::CurrenciesResolver
    field :currency, resolver: Resolvers::CurrencyResolver
    field :current_user, resolver: Resolvers::CurrentUserResolver
    field :transactions, resolver: Resolvers::TransactionsResolver
    field :transactions_by_day, resolver: Resolvers::TransactionsByDayResolver
    field :transaction, resolver: Resolvers::TransactionResolver
    field :favourite_transactions, resolver: Resolvers::FavouriteTransactionsResolver
  end
end
