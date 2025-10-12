class AddCategoryToFavouriteTransactions < ActiveRecord::Migration[7.1]
  def change
    add_reference :favourite_transactions, :category, type: :uuid
  end
end



