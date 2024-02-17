module Deletable
  extend ActiveSupport::Concern

  included do
    scope :deleted, -> { where.not(deleted_at: nil) }
    scope :not_deleted, -> { where(deleted_at: nil) }

    default_scope { not_deleted }
  end

  def mark_deleted!
    update!(deleted_at: Time.zone.now)
  end

  def deleted?
    deleted_at?
  end
end
