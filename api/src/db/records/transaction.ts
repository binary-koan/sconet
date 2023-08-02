export interface TransactionRecord {
  id: string
  memo: string
  date: Date
  includeInReports: boolean

  amount: number | null
  currencyCode: string

  originalAmount: number | null
  originalCurrencyCode: string | null

  categoryId: string | null

  accountId: string

  splitFromId: string | null

  deletedAt: Date | null

  createdAt: Date
  updatedAt: Date
}
