class Category < ApplicationRecord
  include Deletable

  COLORS = %w(gray red orange yellow green teal blue cyan purple pink)
  ICONS = YAML.load_file(Rails.root.join('config', 'data', 'icons.yml'))['icons']

  has_many :category_budgets
  has_one :current_budget, -> { for_date_scope(Date.today) }, class_name: "CategoryBudget"
  has_many :transactions

  validates :name, presence: true
  validates :color, presence: true, inclusion: { in: COLORS }
  validates :icon, presence: true, inclusion: { in: ICONS }
  validates :sort_order, uniqueness: { scope: :deleted_at }
end
