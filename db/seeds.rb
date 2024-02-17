# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

usd = Currency.find_by(code: "USD") || Currency.create!(
  code: "USD",
  name: "US Dollar",
  symbol: "US$",
  decimal_digits: 2
)

Category.find_by(name: "First") || Category.create!(
  name: "First",
  color: "red",
  icon: "ShoppingCart",
  sort_order: 1
)

Category.find_by(name: "Second") || Category.create!(
  name: "Second",
  color: "green",
  icon: "ShoppingCart",
  sort_order: 2
)

account = Account.find_by(name: "Test") || Account.create!(name: "Test", currency: usd)

(ENV["USER_EMAILS"]&.split(",") || []).each do |email|
  User.find_or_initialize_by(email:) || User.create!(
    email:,
    password: "changeme",
    default_currency: usd,
    default_account: account
  )
end
