class CreateExchangeRateValues < ActiveRecord::Migration[7.1]
  def change
    create_table :exchange_rate_values, id: :uuid do |t|
      t.date :date, null: false
      t.belongs_to :from_currency, type: :uuid, null: false
      t.belongs_to :to_currency, type: :uuid, null: false
      t.decimal :rate, null: false

      t.timestamps
    end
  end
end
