FactoryBot.define do
  factory :category_budget do
    category { nil }
    date_from { "2020-01-01" }
    date_to { "2020-01-31" }
    budget_cents { 999 }
    currency
  end
end
