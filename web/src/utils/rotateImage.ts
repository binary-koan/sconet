// Rotates an image 90° clockwise in the browser and returns it as a File for reupload.
// ponytail: canvas re-encode (quality 0.92, EXIF stripped) instead of backend vips — fine for receipts
export const rotateImage = async (url: string, filename: string): Promise<File> => {
  const blob = await (await fetch(url)).blob()
  const bitmap = await createImageBitmap(blob)

  const canvas = document.createElement("canvas")
  canvas.width = bitmap.height
  canvas.height = bitmap.width

  const ctx = canvas.getContext("2d")!
  ctx.translate(canvas.width, 0)
  ctx.rotate(Math.PI / 2)
  ctx.drawImage(bitmap, 0, 0)

  const rotated = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Failed to rotate image"))),
      blob.type || "image/jpeg",
      0.92
    )
  )

  return new File([rotated], filename, { type: rotated.type })
}
