class AddConfirmedToTransactions < ActiveRecord::Migration[7.1]
  def change
    add_column :transactions, :confirmed, :boolean, default: true, null: false
  end
end
