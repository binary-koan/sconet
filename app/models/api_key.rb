class ApiKey < ApplicationRecord
  TOKEN_PREFIX = "sconet_"

  belongs_to :user

  validates :name, presence: true

  # Plaintext token, only available in the request that generated it
  attr_reader :token

  before_validation :generate_token, on: :create

  def self.authenticate(token)
    return if token.blank?

    find_by(token_digest: Digest::SHA256.hexdigest(token), disabled_at: nil)&.user
  end

  def regenerate!
    generate_token
    save!
  end

  def disabled?
    disabled_at.present?
  end

  private

  def generate_token
    @token = "#{TOKEN_PREFIX}#{SecureRandom.hex(32)}"
    self.token_digest = Digest::SHA256.hexdigest(@token)
    self.token_prefix = @token.first(TOKEN_PREFIX.length + 8)
  end
end
