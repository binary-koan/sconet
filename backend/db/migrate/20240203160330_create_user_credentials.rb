class CreateUserCredentials < ActiveRecord::Migration[7.1]
  def change
    create_table :user_credentials, id: :uuid do |t|
      t.belongs_to :user, type: :uuid, null: false
      t.string :device, null: false
      t.binary :credential_id, null: false
      t.binary :credential_public_key, null: false
      t.integer :counter, null: false, default: 0
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
