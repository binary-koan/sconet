class CreateAccounts < ActiveRecord::Migration[7.1]
  def change
    create_table :accounts, id: :uuid do |t|
      t.string :name, null: false
      t.belongs_to :currency, type: :uuid, null: false
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
