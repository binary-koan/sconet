class Account < ApplicationRecord
  include Deletable

  belongs_to :currency
  has_many :transactions

  validates :name, presence: true
  validates :sort_order, uniqueness: { scope: [:deleted_at, :archived_at] }, allow_nil: true
end
