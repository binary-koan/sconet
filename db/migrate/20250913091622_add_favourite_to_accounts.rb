class AddFavouriteToAccounts < ActiveRecord::Migration[7.1]
  def change
    add_column :accounts, :favourite, :boolean, null: false, default: false
  end
end
