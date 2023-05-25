export interface TransactionRecord {
  id: string
  memo: string
  originalMemo: string
  date: Date
  includeInReports: boolean

  amount: number
  currencyCode: string

  categoryId: string | null

  accountId: string

  splitFromId: string | null

  deletedAt: Date | null

  createdAt: Date
  updatedAt: Date
}
