class AddEmojiToCategories < ActiveRecord::Migration[7.1]
  def change
    add_column :categories, :emoji, :string
  end
end
