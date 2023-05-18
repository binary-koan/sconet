import { isEmpty, pickBy } from "lodash"
import { RowList } from "postgres"
import { MakeOptional } from "../../types"
import { sql } from "../database"
import { filterTransactions } from "../queries/transaction/filterTransactions"
import { CurrencyRecord } from "../records/currency"
import { TransactionRecord } from "../records/transaction"
import { createRepo } from "../repo"
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

    findValuesInCurrency: async (ids: string[], currency: CurrencyRecord) => {
      const values = (await sql`
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
            LEFT OUTER JOIN exchangeRateValues ON exchangeRateValues.toCurrencyId = ${
              currency.id
            } AND exchangeRateValues.dailyExchangeRateId = dailyExchangeRates.id
            WHERE transactions.id IN ${sql(ids)}
          `) as RowList<
        Array<{
          id: string
          value: number
          fromDecimalDigits: number
        }>
      >

      const toMultiplier = 10 ** currency.decimalDigits

      return values.map(({ id, value, fromDecimalDigits }) => {
        const fromMultiplier = 10 ** fromDecimalDigits

        return {
          id,
          value: (value / fromMultiplier) * toMultiplier
        }
      })
    },

    async deleteSplitTransactions(fromId: string) {
      await sql`DELETE FROM transactions WHERE splitFromId = ${fromId}`

      return fromId
    },

    async findSplitTransactionsByIds(splitFromIds: readonly string[]) {
      if (!splitFromIds.length) {
        return []
      }

      const allTransactions = (
        await sql`SELECT * FROM transactions WHERE splitFromId IN ${sql(
          splitFromIds
        )} ORDER BY date DESC, id DESC`
      ).map(loadTransaction)

      return splitFromIds.map((id) =>
        allTransactions.filter((transaction) => transaction.splitFromId === id)
      )
    },

    async softDeleteSplitTransactions(fromId: string) {
      await sql`UPDATE transactions SET deletedAt = ${new Date()} WHERE splitFromId = ${fromId}`

      return fromId
    },

    async updateSplitTransactions(fromId: string, fields: Partial<TransactionRecord>) {
      const fieldsToSet = serializeTransaction(pickBy(fields, (value) => value !== undefined))

      if (isEmpty(fieldsToSet)) {
        return fromId
      }

      await sql`UPDATE transactions SET ${sql(fieldsToSet)} WHERE splitFromId = $fromId`

      return fromId
    }
  }
})
