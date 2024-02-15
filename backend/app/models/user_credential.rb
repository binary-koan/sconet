class UserCredential < ApplicationRecord
  include Deletable

  belongs_to :user

  validates :device, :credential_id, :credential_public_key, presence: true
end
