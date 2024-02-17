class CreateCurrencies < ActiveRecord::Migration[7.1]
  def change
    create_table :currencies, id: :uuid do |t|
      t.string :code, null: false
      t.string :name, null: false
      t.string :symbol, null: false
      t.integer :decimal_digits, null: false

      t.timestamps
    end
  end
end
