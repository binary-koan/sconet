class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users, id: :uuid do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :webauthn_challenge
      t.belongs_to :default_currency, type: :uuid
      t.belongs_to :default_account, type: :uuid

      t.timestamps
    end
  end
end
