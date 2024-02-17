FactoryBot.define do
  factory :transaction do
    account
    shop { "Somewhere" }
    date { "2020-06-12" }
    amount_cents { -100 }
    currency
  end
end
