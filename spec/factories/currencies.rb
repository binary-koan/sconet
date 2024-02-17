FactoryBot.define do
  factory :currency do
    sequence(:code) { |n| "USD#{n}" }
    sequence(:name) { |n| "US Dollars #{n}" }
    symbol { "$" }
    decimal_digits { 2 }
  end
end
