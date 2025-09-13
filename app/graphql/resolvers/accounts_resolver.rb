module Resolvers
  class AccountsResolver < BaseResolver
    authenticated

    argument :archived, Boolean, required: false, default_value: false

    type [Types::AccountType], null: false

    def resolve(archived: false)
      if archived
        ::Account.where.not(archived_at: nil).order(:sort_order)
      else
        ::Account.where(archived_at: nil).order(:sort_order)
      end
    end
  end
end
