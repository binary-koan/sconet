# frozen_string_literal: true

module ImageCropper
  # Crops an image IO to the given pixel rectangle, returning a JPEG Tempfile.
  # ponytail: always JPEG on output — Debian's libvips can load HEIC/AVIF but not
  # encode them (no HEVC/AV1 encoders), so preserving the source format breaks in
  # production for iPhone photos. Receipts survive JPEG fine.
  def self.crop(io, x:, y:, width:, height:)
    Tempfile.create(%w[crop-src .img], binmode: true) do |source|
      IO.copy_stream(io, source)
      source.flush
      ImageProcessing::Vips.source(source.path).crop(x, y, width, height).convert("jpeg").call
    end
  end
end
