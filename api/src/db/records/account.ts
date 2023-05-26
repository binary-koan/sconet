export interface AccountRecord {
  id: string
  name: string
  currencyCode: string

  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
