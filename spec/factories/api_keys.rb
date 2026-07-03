FactoryBot.define do
  factory :api_key do
    user
    sequence(:name) { |n| "API Key #{n}" }
  end
end
