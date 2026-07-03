class FixActiveStorageRecordIdType < ActiveRecord::Migration[7.1]
  def up
    # record_id was bigint but transactions use UUID primary keys, so existing
    # rows hold truncated ids and are unrecoverable. Blobs are left in storage.
    execute "DELETE FROM active_storage_attachments"

    remove_column :active_storage_attachments, :record_id
    add_column :active_storage_attachments, :record_id, :uuid, null: false

    add_index :active_storage_attachments,
              [:record_type, :record_id, :name, :blob_id],
              name: :index_active_storage_attachments_uniqueness,
              unique: true
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
