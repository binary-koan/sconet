# frozen_string_literal: true

module Types
  class UploadType < Types::BaseScalar
    description "Represents an uploaded file"

    def self.coerce_input(value, _context)
      return nil unless value
      
      # Handle ActionDispatch::Http::UploadedFile
      value
    end

    def self.coerce_result(value, _context)
      # We don't return uploads, so this shouldn't be called
      raise GraphQL::ExecutionError, "Upload type cannot be used as output"
    end
  end
end

