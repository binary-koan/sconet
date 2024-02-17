module Resolvers
  class TransactionsResolver < BaseResolver
    authenticated

    type Types::TransactionType.connection_type, null: false

    argument :filter, Types::TransactionFilterInputType, required: false

    def resolve(filter: nil)
      scope = ::Transaction.top_level

      if filter&.date_from.present?
        scope = scope.where('date >= ?', filter.date_from)
      end

      if filter&.date_until.present?
        scope = scope.where('date <= ?', filter.date_until)
      end

      if filter&.min_amount_cents.present?
        scope = scope.where('amount_cents >= ?', filter.min_amount_cents)
      end

      if filter&.max_amount_cents.present?
        scope = scope.where('amount_cents <= ?', filter.max_amount_cents)
      end

      if filter&.keyword.present?
        scope = scope.where('shop ILIKE :keyword OR memo ILIKE :keyword', keyword: "%#{filter.keyword}%")
      end

      if filter&.category_ids.present?
        scope = scope.where(category_id: filter.category_ids)
      end

      scope.in_display_order
    end
  end
end
