import { isEmpty, pickBy } from "lodash"
import { RowList } from "postgres"
import { sql } from "../database"
import { filterTransactions } from "../queries/transaction/filterTransactions"
import { CurrencyRecord } from "../records/currency"
import { TransactionRecord } from "../records/transaction"
import { createRepo } from "../repo"

interface TransactionMethods {
  filter: typeof filterTransactions
  findValuesInCurrency: (
    ids: string[],
    currency: CurrencyRecord
  ) => Promise<Array<{ id: string; value: number }>>
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

    findValuesInCurrency: async (ids, currency) => {
      const values = (await sql`
        SELECT
          "transactions"."id" AS "id",
          (CASE
            WHEN "exchangeRateValues"."rate" IS NOT NULL THEN "transactions"."amount" * "exchangeRateValues"."rate"
            ELSE "transactions"."amount"
          END) AS "value",
          "currencies"."decimalDigits" AS "fromDecimalDigits"
        FROM "transactions"
        INNER JOIN "currencies" ON "transactions"."currencyId" = "currencies"."id"
        LEFT OUTER JOIN "dailyExchangeRates" ON "transactions"."dailyExchangeRateId" = "dailyExchangeRates"."id"
        LEFT OUTER JOIN "exchangeRateValues" ON "exchangeRateValues"."toCurrencyId" = ${
          currency.id
        } AND "exchangeRateValues"."dailyExchangeRateId" = "dailyExchangeRates"."id"
        WHERE "transactions"."id" IN ${sql(ids)}
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
