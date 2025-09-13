class FavouriteTransaction < ApplicationRecord
  belongs_to :user
  belongs_to :account, optional: true

  validates :name, presence: true
  validates :shop, presence: true
end


