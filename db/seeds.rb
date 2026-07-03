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

gbp = Currency.find_by(code: "GBP") || Currency.create!(
  code: "GBP",
  name: "Pounds Sterling",
  symbol: "£",
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

account = Account.find_by(name: "Test") || Account.create!(name: "Test", currency: usd, sort_order: 1)

groceries = Category.find_by(name: "First")
fun = Category.find_by(name: "Second")

# ponytail: inline SVG placeholder instead of bundling image fixtures
def placeholder_receipt(shop, amount)
  svg = <<~SVG
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400">
      <rect width="100%" height="100%" fill="#f5f0e6"/>
      <text x="150" y="60" text-anchor="middle" font-family="monospace" font-size="20">#{shop}</text>
      <text x="150" y="200" text-anchor="middle" font-family="monospace" font-size="16">RECEIPT</text>
      <text x="150" y="340" text-anchor="middle" font-family="monospace" font-size="20">#{amount}</text>
    </svg>
  SVG
  { io: StringIO.new(svg), filename: "receipt.svg", content_type: "image/svg+xml" }
end

if Transaction.none?
  [
    { shop: "Countdown", memo: "Weekly groceries", days_ago: 1, amount_cents: -8450, category: groceries },
    { shop: "Coffee Corner", memo: "Flat white", days_ago: 1, amount_cents: -550, category: fun },
    { shop: "Bookshop", memo: "", days_ago: 2, amount_cents: -3200, category: fun },
    { shop: "Employer", memo: "Salary", days_ago: 3, amount_cents: 250_000 },
    { shop: "Corner Store", memo: "Sunday market", days_ago: 4, amount_cents: -1899, category: groceries, shop_amount_cents: -1500, shop_currency: gbp },
    { shop: "Petrol Station", memo: "", days_ago: 5, amount_cents: -7000 },
    { shop: "Pharmacy", memo: "", days_ago: 6, amount_cents: -2340, category: groceries },
    { shop: "Cinema", memo: "Movie night", days_ago: 8, amount_cents: -2800, category: fun },
    { shop: "Unknown Shop", memo: "Scanned receipt", days_ago: 0, amount_cents: -1250, confirmed: false, receipt: true },
    { shop: "Blurry Cafe", memo: "", days_ago: 1, amount_cents: -975, category: fun, confirmed: false, receipt: true },
    { shop: "Hardware Store", memo: "Needs review", days_ago: 2, amount_cents: -15_600, confirmed: false, receipt: true },
  ].each do |attrs|
    receipt = attrs.delete(:receipt)
    days_ago = attrs.delete(:days_ago)
    transaction = Transaction.create!(
      account:,
      currency: usd,
      date: Date.today - days_ago,
      **attrs
    )
    if receipt
      transaction.receipt_images.attach(placeholder_receipt(transaction.shop, transaction.amount_cents))
    end
  end
end

User.find_by(email: "test@example.com") || User.create!(
  email: "test@example.com",
  password: "changeme",
  default_currency: usd,
  default_account: account
)
