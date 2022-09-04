export interface CurrencyRecord {
  id: string
  code: string
  symbol: string
  decimalDigits: number

  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
