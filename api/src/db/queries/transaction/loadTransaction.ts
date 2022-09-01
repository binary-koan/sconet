import { TransactionRecord } from "../transaction"

export function loadTransaction(row: any): TransactionRecord {
  return {
    id: row.id,
    memo: row.memo,
    originalMemo: row.originalMemo,
    amount: row.amount,
    date: new Date(row.date),
    includeInReports: Boolean(row.includeInReports),
    categoryId: row.categoryId,
    accountMailboxId: row.accountMailboxId,
    remoteId: row.remoteId,
    splitFromId: row.splitFromId,
    deletedAt: row.deletedAt && new Date(row.deletedAt),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  }
}
