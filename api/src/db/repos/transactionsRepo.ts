import { isEmpty, pickBy } from "lodash"
import { MakeOptional } from "../../types"
import { db } from "../database"
import { filterTransactions } from "../queries/transaction/filterTransactions"
import { CurrencyRecord } from "../records/currency"
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
  defaultOrder: { date: "DESC", amount: "DESC", id: "ASC" },
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

    findValuesInCurrency: (ids: string[], currency: CurrencyRecord) => {
      const values = db
        .query(
          `
            SELECT
              transactions.id AS id,
              (CASE
                WHEN exchangeRateValues.rate IS NOT NULL THEN transactions.amount * exchangeRateValues.rate
                ELSE transactions.amount
              END) AS value,
              currencies.decimalDigits AS fromDecimalDigits
            FROM transactions
            INNER JOIN currencies ON transactions.currencyId = currencies.id
            LEFT OUTER JOIN dailyExchangeRates ON transactions.dailyExchangeRateId = dailyExchangeRates.id
            LEFT OUTER JOIN exchangeRateValues ON exchangeRateValues.toCurrencyId = $currencyId AND exchangeRateValues.dailyExchangeRateId = dailyExchangeRates.id
            WHERE transactions.id IN ${arrayQuery(ids)}
          `
        )
        .all({ ...arrayBindings(ids), $currencyId: currency.id }) as Array<{
        id: string
        value: number
        fromDecimalDigits: number
      }>

      const toMultiplier = 10 ** currency.decimalDigits

      return values.map(({ id, value, fromDecimalDigits }) => {
        const fromMultiplier = 10 ** fromDecimalDigits

        return {
          id,
          value: (value / fromMultiplier) * toMultiplier
        }
      })
    },

    deleteSplitTransactions(fromId: string) {
      db.query(`DELETE FROM transactions WHERE splitFromId = $id`).run({
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
      db.query(`UPDATE transactions SET deletedAt = $now WHERE splitFromId = $id`).run({
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

      db.query(
        `UPDATE transactions SET ${fieldsUpdateQuery(fieldsToSet)} WHERE splitFromId = $fromId`
      ).run({
        ...fieldBindings({ fromId, ...fieldsToSet })
      })

      return fromId
    }
  }
})
