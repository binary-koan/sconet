import { TransactionRecord } from "../../records/transaction"
import { loadDate } from "../../utils"

export function loadTransaction(row: any): TransactionRecord {
  return {
    id: row.id,
    memo: row.memo,
    originalMemo: row.originalMemo,
    amount: row.amount,
    currencyId: row.currencyId,
    date: loadDate(row.date as number),
    includeInReports: Boolean(row.includeInReports),
    categoryId: row.categoryId,
    accountMailboxId: row.accountMailboxId,
    remoteId: row.remoteId,
    splitFromId: row.splitFromId,
    deletedAt: loadDate(row.deletedAt),
    createdAt: loadDate(row.createdAt as number),
    updatedAt: loadDate(row.updatedAt as number)
  }
}
