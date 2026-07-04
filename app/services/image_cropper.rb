# frozen_string_literal: true

module ImageCropper
  # Crops an image IO to the given pixel rectangle, returning a Tempfile in the source format.
  def self.crop(io, x:, y:, width:, height:)
    Tempfile.create(%w[crop-src .img], binmode: true) do |source|
      IO.copy_stream(io, source)
      source.flush
      # ponytail: format sniffed from the vips loader name ("jpegload" -> "jpeg") so the crop keeps the source format
      format = Vips::Image.new_from_file(source.path).get("vips-loader").sub(/load.*/, "")
      ImageProcessing::Vips.source(source.path).crop(x, y, width, height).convert(format).call
    end
  end
end
