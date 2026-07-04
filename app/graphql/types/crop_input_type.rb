# frozen_string_literal: true

module Types
  class CropInputType < BaseInputObject
    description "A pixel rectangle to crop an image to"

    argument :x, Integer, required: true
    argument :y, Integer, required: true
    argument :width, Integer, required: true
    argument :height, Integer, required: true
  end
end
