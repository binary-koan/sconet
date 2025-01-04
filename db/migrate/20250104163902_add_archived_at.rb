class AddArchivedAt < ActiveRecord::Migration[7.1]
  def change
    add_column :categories, :archived_at, :datetime
    add_column :accounts, :archived_at, :datetime
  end
end

