import { isEmpty, pickBy } from "lodash"
import { db } from "../database"
import { filterTransactions } from "../queries/transaction/filterTransactions"
import { updateSplitAmounts } from "../queries/transaction/updateSplitAmounts"
import { TransactionRecord } from "../records/transaction"
import { createRepo } from "../repo"

interface TransactionMethods {
  filter: typeof filterTransactions
}

interface TransactionAsyncMethods {
  updateSplitAmounts: (
    id: string,
    updatedAmount: number,
    field?: "amount" | "originalAmount"
  ) => Promise<void>
  deleteSplitTransactions: (fromId: string) => Promise<string>
  findSplitTransactionsByIds: (splitFromIds: readonly string[]) => Promise<TransactionRecord[][]>
  softDeleteSplitTransactions: (fromId: string) => Promise<string>
  updateSplitTransactions: (fromId: string, updates: Partial<TransactionRecord>) => Promise<string>
  updateAccountTransactions: (
    accountId: string,
    updates: Partial<TransactionRecord>
  ) => Promise<void>
}

export const transactionsRepo = createRepo<
  TransactionRecord,
  TransactionMethods,
  TransactionAsyncMethods
>({
  tableName: "transactions",
  defaultOrder: { date: "DESC", amount: "ASC", id: "ASC" },

  methods: { filter: filterTransactions },

  asyncMethods: {
    updateSplitAmounts,

    async deleteSplitTransactions(fromId) {
      await db.sql`DELETE FROM "transactions" WHERE "splitFromId" = ${fromId}`

      return fromId
    },

    async findSplitTransactionsByIds(splitFromIds) {
      if (!splitFromIds.length) {
        return []
      }

      const allTransactions = await db.sql<
        TransactionRecord[]
      >`SELECT * FROM "transactions" WHERE "splitFromId" IN ${db.sql(
        splitFromIds
      )} ORDER BY date DESC, amount ASC, id ASC`

      return splitFromIds.map((id) =>
        allTransactions.filter((transaction) => transaction.splitFromId === id)
      )
    },

    async softDeleteSplitTransactions(fromId) {
      await db.sql`UPDATE "transactions" SET "deletedAt" = ${new Date()} WHERE "splitFromId" = ${fromId}`

      return fromId
    },

    async updateSplitTransactions(fromId, fields) {
      const fieldsToSet = pickBy(fields, (value) => value !== undefined)

      if (isEmpty(fieldsToSet)) {
        return fromId
      }

      await db.sql`UPDATE "transactions" SET ${db.sql(fieldsToSet)} WHERE "splitFromId" = ${fromId}`

      return fromId
    },

    async updateAccountTransactions(accountId, fields) {
      const fieldsToSet = pickBy(fields, (value) => value !== undefined)

      if (isEmpty(fieldsToSet)) {
        return
      }

      await db.sql`UPDATE "transactions" SET ${db.sql(
        fieldsToSet
      )} WHERE "accountId" = ${accountId}`
    }
  }
})
