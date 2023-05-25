import { isEmpty, pickBy } from "lodash"
import { sql } from "../database"
import { filterTransactions } from "../queries/transaction/filterTransactions"
import { TransactionRecord } from "../records/transaction"
import { createRepo } from "../repo"

interface TransactionMethods {
  filter: typeof filterTransactions
  deleteSplitTransactions: (fromId: string) => Promise<string>
  findSplitTransactionsByIds: (splitFromIds: readonly string[]) => Promise<TransactionRecord[][]>
  softDeleteSplitTransactions: (fromId: string) => Promise<string>
  updateSplitTransactions: (fromId: string, updates: Partial<TransactionRecord>) => Promise<string>
}

export const transactionsRepo = createRepo<TransactionRecord, TransactionMethods>({
  tableName: "transactions",
  defaultOrder: { date: "DESC", amount: "DESC", id: "ASC" },

  methods: {
    filter: filterTransactions,

    async deleteSplitTransactions(fromId) {
      await sql`DELETE FROM "transactions" WHERE "splitFromId" = ${fromId}`

      return fromId
    },

    async findSplitTransactionsByIds(splitFromIds) {
      if (!splitFromIds.length) {
        return []
      }

      const allTransactions = await sql<
        TransactionRecord[]
      >`SELECT * FROM "transactions" WHERE "splitFromId" IN ${sql(
        splitFromIds
      )} ORDER BY date DESC, id DESC`

      return splitFromIds.map((id) =>
        allTransactions.filter((transaction) => transaction.splitFromId === id)
      )
    },

    async softDeleteSplitTransactions(fromId) {
      await sql`UPDATE "transactions" SET "deletedAt" = ${new Date()} WHERE "splitFromId" = ${fromId}`

      return fromId
    },

    async updateSplitTransactions(fromId, fields) {
      const fieldsToSet = pickBy(fields, (value) => value !== undefined)

      if (isEmpty(fieldsToSet)) {
        return fromId
      }

      await sql`UPDATE "transactions" SET ${sql(fieldsToSet)} WHERE "splitFromId" = ${fromId}`

      return fromId
    }
  }
})
