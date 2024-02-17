# frozen_string_literal: true

module Types
  class MoneyType < Types::BaseObject
    field :amount_cents, Integer, null: false
    field :amount_decimal, Float, null: false
    field :formatted, String, null: false
    field :formatted_short, String, null: false
  end
end
