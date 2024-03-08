class User < ApplicationRecord
  has_secure_password

  belongs_to :default_currency, class_name: "Currency", optional: true
  belongs_to :default_account, class_name: "Account", optional: true
  has_many :user_currency_favourites
  has_many :favourite_currencies, through: :user_currency_favourites, source: :currency
  has_many :user_credentials

  validates :email, presence: true, uniqueness: true

  def self.find_by_jwt(jwt)
    return if jwt.blank?
    User.find_by(id: JWT.decode(jwt, Rails.application.credentials.secret_key_base, true, {algorithm: 'HS256'})[0]['user_id'])
  rescue JWT::DecodeError => e
    Sentry.capture_message("JWT decode error: #{e.message}")
    nil
  end

  def generate_jwt
    JWT.encode({ "user_id" => id, "exp" => (Time.now + 2.weeks).to_i }, Rails.application.credentials.secret_key_base, 'HS256')
  end
end
