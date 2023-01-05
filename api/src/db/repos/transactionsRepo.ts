import { isEmpty, pickBy } from "lodash"
import { MakeOptional } from "../../types"
import { db } from "../database"
import { filterTransactions } from "../queries/transaction/filterTransactions"
import { TransactionRecord } from "../records/transaction"
import { createRepo } from "../repo"
import { serializeDate } from "../utils"
import { arrayBindings, arrayQuery, fieldBindings, fieldsUpdateQuery } from "../utils/fields"
import { loadTransaction } from "./transactions/loadTransaction"
import { serializeTransaction } from "./transactions/serializeTransaction"

export type TransactionForInsert = MakeOptional<
  Omit<TransactionRecord, "id">,
  "categoryId" | "remoteId" | "splitFromId" | "deletedAt" | "createdAt" | "updatedAt"
>

export const transactionsRepo = createRepo({
  tableName: "transactions",
  defaultOrder: { date: "DESC", id: "DESC" },
  load: loadTransaction,
  serialize: serializeTransaction,

  formatForInsert: (transaction: TransactionForInsert) => ({
    categoryId: null,
    remoteId: null,
    splitFromId: null,
    ...transaction
  }),

  methods: {
    filter: filterTransactions,

    deleteSplitTransactions(fromId: string) {
      db.run(`DELETE FROM transactions WHERE splitFromId = $id`, {
        $id: fromId
      })

      return fromId
    },

    findSplitTransactionsByIds(splitFromIds: readonly string[]) {
      if (!splitFromIds.length) {
        return []
      }

      const allTransactions = db
        .query(
          `SELECT * FROM transactions WHERE splitFromId IN ${arrayQuery(
            splitFromIds
          )} ORDER BY date DESC, id DESC`
        )
        .all(arrayBindings(splitFromIds))
        .map(loadTransaction)

      return splitFromIds.map((id) =>
        allTransactions.filter((transaction) => transaction.splitFromId === id)
      )
    },

    softDeleteSplitTransactions(fromId: string) {
      db.run(`UPDATE transactions SET deletedAt = $now WHERE splitFromId = $id`, {
        $id: fromId,
        $now: serializeDate(new Date())
      })

      return fromId
    },

    updateSplitTransactions(fromId: string, fields: Partial<TransactionRecord>) {
      const fieldsToSet = serializeTransaction(pickBy(fields, (value) => value !== undefined))

      if (isEmpty(fieldsToSet)) {
        return fromId
      }

      db.run(
        `UPDATE transactions SET ${fieldsUpdateQuery(fieldsToSet)} WHERE splitFromId = $fromId`,
        {
          ...fieldBindings({ fromId, ...fieldsToSet })
        }
      )

      return fromId
    }
  }
})
