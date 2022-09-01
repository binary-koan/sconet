export interface TransactionRecord {
  id: string
  memo: string
  originalMemo: string
  amount: number
  currency: string
  date: Date
  includeInReports: boolean

  categoryId: string | null

  accountMailboxId: string
  remoteId: string | null

  splitFromId: string | null

  deletedAt: Date | null

  createdAt: Date
  updatedAt: Date
}
