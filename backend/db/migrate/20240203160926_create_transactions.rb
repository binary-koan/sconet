class CreateTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :transactions, id: :uuid do |t|
      t.string :shop, null: false, default: ""
      t.string :memo, null: false, default: ""
      t.date :date, null: false
      t.boolean :include_in_reports, null: false, default: true
      t.integer :amount_cents
      t.belongs_to :currency, type: :uuid
      t.integer :shop_amount_cents
      t.belongs_to :shop_currency, type: :uuid
      t.belongs_to :category, type: :uuid
      t.belongs_to :account, type: :uuid, null: false
      t.belongs_to :split_from, type: :uuid
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
