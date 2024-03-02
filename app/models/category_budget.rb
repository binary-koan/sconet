class CategoryBudget < ApplicationRecord
  belongs_to :category
  belongs_to :currency

  validates :date_from, presence: true
  validates :date_from, :date_to, uniqueness: { scope: :category_id }
  validates :budget_cents, numericality: { greater_than_or_equal_to: 0 }

  scope :for_date_scope, ->(date) { order(date_from: :asc).where("date_from <= :date AND (date_to >= :date OR date_to IS NULL)", date: date) }

  def self.for_date(date)
    for_date_scope(date).first
  end

  def budget
    Money.new(amount_cents: budget_cents, currency:)
  end
end
