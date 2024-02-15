class CreateCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :categories, id: :uuid do |t|
      t.string :name, null: false
      t.string :color, null: false
      t.string :icon, null: false
      t.boolean :regular, null: false, default: false
      t.integer :sort_order, null: false
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
