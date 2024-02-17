class Currency < ApplicationRecord
  has_many :category_budgets
  has_many :transactions
  has_many :shop_transactions, foreign_key: :shop_currency_id, class_name: 'Transaction'
  has_many :from_exchange_rate_values, foreign_key: :from_currency_id, class_name: 'ExchangeRateValue'
  has_many :to_exchange_rate_values, foreign_key: :to_currency_id, class_name: 'DailyExchangeRate'

  validates :code, :name, presence: true, uniqueness: true
  validates :symbol, presence: true
  validates :decimal_digits, numericality: { greater_than_or_equal_to: 0 }
end
