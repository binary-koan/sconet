import { TransactionRecord } from "../../records/transaction"

export function loadTransaction(row: any): TransactionRecord {
  return {
    id: row.id,
    memo: row.memo,
    originalMemo: row.originalMemo,
    amount: row.amount,
    currencyId: row.currencyId,
    date: row.date,
    includeInReports: Boolean(row.includeInReports),
    categoryId: row.categoryId,
    accountId: row.accountId,
    remoteId: row.remoteId,
    splitFromId: row.splitFromId,
    dailyExchangeRateId: row.dailyExchangeRateId,
    deletedAt: row.deletedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}
