class AddSortOrderToAccounts < ActiveRecord::Migration[7.1]
  def up
    add_column :accounts, :sort_order, :integer, null: true

    execute <<-SQL.squish
      UPDATE accounts
      SET sort_order = sub.rn
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY name) AS rn
        FROM accounts
        WHERE archived_at IS NULL
      ) AS sub
      WHERE accounts.id = sub.id
    SQL

    execute <<-SQL.squish
      UPDATE accounts
      SET sort_order = sub.rn
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY name) AS rn
        FROM accounts
        WHERE archived_at IS NOT NULL
      ) AS sub
      WHERE accounts.id = sub.id
    SQL

    change_column_null :accounts, :sort_order, false
  end

  def down
    remove_column :accounts, :sort_order
  end
end


