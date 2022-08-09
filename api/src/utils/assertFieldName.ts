export function assertFieldName(field: string) {
  if (!/^[a-z_][a-z0-9_]*$/i.test(field)) {
    throw new Error(`Invalid field name in database query: ${field}`)
  }

  return true
}
