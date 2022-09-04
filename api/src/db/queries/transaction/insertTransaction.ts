import { db } from "../../database"
import { TransactionRecord } from "../../records/transaction"
import ObjectID from "bson-objectid"
import { MakeOptional } from "../../../types"
import { serializeDate } from "../../utils"

export type TransactionForInsert = MakeOptional<
  Omit<TransactionRecord, "id">,
  "categoryId" | "remoteId" | "splitFromId" | "deletedAt" | "createdAt" | "updatedAt"
>

export function insertTransaction(transaction: TransactionForInsert) {
  const id = ObjectID().toHexString()

  db.run(
    `
    INSERT INTO transactions
      (id, memo, originalMemo, amount, currencyId, date, includeInReports, categoryId, accountMailboxId, remoteId, splitFromId, deletedAt, createdAt, updatedAt)
    VALUES
      ($id, $memo, $originalMemo, $amount, $currencyId, $date, $includeInReports, $categoryId, $accountMailboxId, $remoteId, $splitFromId, $deletedAt, $createdAt, $updatedAt)
  `,
    {
      $id: id,
      $memo: transaction.memo,
      $originalMemo: transaction.originalMemo,
      $amount: transaction.amount,
      $currencyId: transaction.currencyId,
      $date: serializeDate(transaction.date),
      $includeInReports: transaction.includeInReports,
      $categoryId: transaction.categoryId,
      $accountMailboxId: transaction.accountMailboxId,
      $remoteId: transaction.remoteId,
      $splitFromId: transaction.splitFromId,
      $deletedAt: serializeDate(transaction.deletedAt),
      $createdAt: serializeDate(transaction.createdAt || new Date()),
      $updatedAt: serializeDate(transaction.updatedAt || new Date())
    }
  )

  return id
}
