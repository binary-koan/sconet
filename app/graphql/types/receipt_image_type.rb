# frozen_string_literal: true

module Types
  class ReceiptImageType < Types::BaseObject
    field :id, ID, null: false
    field :url, String, null: false
    field :filename, String, null: false
    field :content_type, String, null: false
    field :byte_size, Integer, null: false

    def url
      Rails.application.routes.url_helpers.rails_blob_url(object, only_path: true)
    end

    def filename
      object.filename.to_s
    end

    def content_type
      object.content_type
    end

    def byte_size
      object.byte_size
    end
  end
end

