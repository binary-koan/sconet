FactoryBot.define do
  factory :user_credential do
    user
    device { "My phone" }
    credential_id { "123456" }
    credential_public_key { "123456" }
  end
end
