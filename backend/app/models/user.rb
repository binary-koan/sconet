class User < ApplicationRecord
  has_secure_password

  belongs_to :default_currency, class_name: "Currency", optional: true
  belongs_to :default_account, class_name: "Account", optional: true
  has_many :user_currency_favourites
  has_many :favourite_currencies, through: :user_currency_favourites, source: :currency
  has_many :user_credentials

  validates :email, presence: true, uniqueness: true

  def self.find_by_jwt(jwt)
    User.find_by(id: JWT.decode(jwt, Rails.application.credentials.secret_key_base, true, {algorithm: 'HS256'})[0]['user_id'])
  end

  def generate_jwt
    JWT.encode({ 'user_id' => id }, Rails.application.credentials.secret_key_base, 'HS256')
  end
end
