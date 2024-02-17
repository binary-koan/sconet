class CreateCategoryBudgets < ActiveRecord::Migration[7.1]
  def change
    create_table :category_budgets, id: :uuid do |t|
      t.belongs_to :category, type: :uuid, null: false
      t.date :date_from, null: false
      t.date :date_to
      t.integer :budget_cents, null: false
      t.belongs_to :currency, type: :uuid, null: false
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
