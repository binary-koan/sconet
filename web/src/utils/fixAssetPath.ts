export function fixAssetPath(assetPath: string) {
  // Bun returns relative paths for assets, so we need to remove the leading dot
  let path = assetPath.replace(/^\./, "")
  if (!path.startsWith("/")) {
    path = `/${path}`
  }
  return path
}
