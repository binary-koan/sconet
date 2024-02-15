class CreateUserCurrencyFavourites < ActiveRecord::Migration[7.1]
  def change
    create_table :user_currency_favourites, id: :uuid do |t|
      t.belongs_to :user, type: :uuid, null: false
      t.belongs_to :currency, type: :uuid, null: false

      t.timestamps
    end
  end
end
