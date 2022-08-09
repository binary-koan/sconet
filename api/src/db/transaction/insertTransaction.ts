import { db } from "../database"
import { TransactionRecord } from "../transaction"
import ObjectID from "bson-objectid"
import { MakeOptional } from "../../types"

export type TransactionForInsert = MakeOptional<
  Omit<TransactionRecord, "id">,
  "categoryId" | "remoteId" | "splitFromId" | "deletedAt" | "createdAt" | "updatedAt"
>

export function insertTransaction(transaction: TransactionForInsert) {
  const id = ObjectID().toHexString()

  db.run(
    `
    INSERT INTO transactions
      (id, memo, originalMemo, amount, date, includeInReports, categoryId, accountMailboxId, remoteId, splitFromId, deletedAt, createdAt, updatedAt)
    VALUES
      ($id, $memo, $originalMemo, $amount, $date, $includeInReports, $categoryId, $accountMailboxId, $remoteId, $splitFromId, $deletedAt, $createdAt, $updatedAt)
  `,
    {
      $id: id,
      $memo: transaction.memo,
      $originalMemo: transaction.originalMemo,
      $amount: transaction.amount,
      $date: transaction.date.getTime(),
      $includeInReports: transaction.includeInReports,
      $categoryId: transaction.categoryId,
      $accountMailboxId: transaction.accountMailboxId,
      $remoteId: transaction.remoteId,
      $splitFromId: transaction.splitFromId,
      $deletedAt: transaction.deletedAt?.getTime(),
      $createdAt: (transaction.createdAt || new Date()).getTime(),
      $updatedAt: (transaction.updatedAt || new Date()).getTime()
    }
  )

  return id
}
