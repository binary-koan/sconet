class Transaction < ApplicationRecord
  include Deletable

  belongs_to :account
  belongs_to :category, optional: true
  belongs_to :split_from, class_name: 'Transaction', optional: true
  belongs_to :currency, optional: true
  belongs_to :shop_currency, class_name: 'Currency', optional: true

  has_many :split_to, class_name: 'Transaction', foreign_key: :split_from_id

  scope :for_analytics, -> { where(include_in_reports: true).where('split_from_id IS NOT NULL OR NOT EXISTS (SELECT 1 FROM transactions split WHERE split.split_from_id = transactions.id)') }
  scope :top_level, -> { where(split_from_id: nil) }
  scope :in_display_order, -> { order(date: :desc, amount_cents: :asc, shop: :asc) }

  validates :date, :shop, presence: true
  validates :currency_id, presence: true, if: :amount_cents
  validates :shop_currency_id, presence: true, if: :shop_amount_cents
  validates :category, absence: true, if: :income?
  validate :amount_or_shop_amount_present

  before_validation :clear_duplicate_shop_amount

  attr_accessor :amount_in_currency, :shop_amount_in_currency

  def expense?
    amount_cents && amount_cents <= 0
  end

  def income?
    amount_cents && amount_cents > 0
  end

  def amount
    MoneyOnDate.new(amount_cents:, currency:, date:) if amount_cents.present?
  end

  def shop_amount
    MoneyOnDate.new(amount_cents: shop_amount_cents, currency: shop_currency, date:) if shop_amount_cents.present?
  end

  private

  def clear_duplicate_shop_amount
    if shop_currency_id == currency_id && shop_amount_cents == amount_cents
      self.shop_currency_id = nil
      self.shop_amount_cents = nil
    end
  end

  def amount_or_shop_amount_present
    return if amount_cents.present? || shop_amount_cents.present?

    errors.add(:base, 'Either amount or shop amount must be present')
  end
end
