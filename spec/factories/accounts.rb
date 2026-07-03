FactoryBot.define do
  factory :account do
    currency
    name { "My Account" }
    sequence(:sort_order)
  end
end
