export function fixAssetPath(assetPath: string) {
  // Bun returns relative paths for assets, so we need to remove the leading dot
  return assetPath.replace(/^\./, "");
}
