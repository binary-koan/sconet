# frozen_string_literal: true

module Types
  class TransactionType < Types::BaseObject
    field :id, ID, null: false
    field :shop, String, null: false
    field :memo, String, null: false
    field :date, GraphQL::Types::ISO8601Date, null: false
    field :include_in_reports, Boolean, null: false
    field :amount, Types::MoneyType do
      argument :currency_id, ID, required: false
    end
    field :currency, Types::CurrencyType
    field :shop_amount, Types::MoneyType do
      argument :currency_id, ID, required: false
    end
    field :shop_currency, Types::CurrencyType
    field :category, Types::CategoryType
    field :account, Types::AccountType, null: false
    field :split_from, Types::TransactionType
    field :split_to, [Types::TransactionType], null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def amount(currency_id: nil)
      return object.amount if currency_id.blank?
      return object.amount_in_currency if object.amount_in_currency&.currency&.id == currency_id

      ExchangeRates::ConvertMoney.new([object.amount], to_currency: Currency.find(currency_id)).call.sum
    end

    def shop_amount(currency_id: nil)
      return object.shop_amount if currency_id.blank?
      return object.shop_amount_in_currency if object.shop_amount_in_currency&.currency&.id == currency_id

      ExchangeRates::ConvertMoney.new([object.shop_amount], to_currency: Currency.find(currency_id)).call.sum
    end
  end
end
