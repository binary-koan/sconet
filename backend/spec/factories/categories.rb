FactoryBot.define do
  factory :category do
    name { "My Category" }
    color { "red" }
    icon { "3dCubeSphere" }
    sequence(:sort_order) { |n| n + 1 }
  end
end
