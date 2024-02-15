class Account < ApplicationRecord
  include Deletable

  belongs_to :currency
  has_many :transactions

  validates :name, presence: true
end
