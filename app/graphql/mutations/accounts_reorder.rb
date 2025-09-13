# frozen_string_literal: true

module Mutations
  class AccountsReorder < BaseMutation
    authenticated

    description "Reorders accounts"

    field :accounts, [Types::AccountType], null: false

    argument :ordered_ids, [ID], required: true

    def resolve(ordered_ids:)
      accounts = ::Account.where(archived_at: nil).index_by(&:id)

      if ordered_ids.sort != accounts.keys.sort
        raise GraphqlErrors::ValidationError.new "Must include all account IDs"
      end

      ordered_ids.each_with_index do |id, index|
        accounts[id].update_attribute(:sort_order, index + 1)
      end

      { accounts: accounts.values.sort_by(&:sort_order) }
    end
  end
end


