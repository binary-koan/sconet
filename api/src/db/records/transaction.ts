export interface TransactionRecord {
  id: string
  memo: string
  originalMemo: string
  amount: number
  date: Date
  includeInReports: boolean

  currencyId: string
  dailyExchangeRateId: string
  categoryId: string | null

  accountMailboxId: string
  remoteId: string | null

  splitFromId: string | null

  deletedAt: Date | null

  createdAt: Date
  updatedAt: Date
}
