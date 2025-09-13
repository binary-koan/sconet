class CreateFavouriteTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :favourite_transactions, id: :uuid do |t|
      t.belongs_to :user, type: :uuid, null: false
      t.string :name, null: false
      t.string :shop, null: false, default: ""
      t.string :memo, null: false, default: ""
      t.integer :price_cents
      t.belongs_to :account, type: :uuid

      t.timestamps
    end
  end
end
