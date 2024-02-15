# frozen_string_literal: true

module Types
  class CategoryInputType < Types::BaseInputObject
    argument :name, String, required: false
    argument :color, String, required: false
    argument :icon, String, required: false
    argument :is_regular, Boolean, required: false
    argument :budget_cents, Integer, required: false
    argument :budget_currency_id, ID, required: false
  end
end
