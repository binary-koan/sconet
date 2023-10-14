import { db } from "../database"
import { DailyExchangeRateRecord } from "../records/dailyExchangeRate"
import { ExchangeRateValueRecord } from "../records/exchangeRateValue"
import { createRepo } from "../repo"

interface ExchangeRateValueMethods {
  findForRate: (
    dailyExchangeRate: Pick<DailyExchangeRateRecord, "id">
  ) => Promise<ExchangeRateValueRecord[]>
  findForRates: (ids: string[]) => Promise<ExchangeRateValueRecord[]>
}

export const exchangeRateValuesRepo = createRepo<
  ExchangeRateValueRecord,
  Record<string, never>,
  ExchangeRateValueMethods
>({
  tableName: "exchangeRateValues",
  defaultOrder: { id: "ASC" },

  methods: {},

  asyncMethods: {
    findForRate: async (dailyExchangeRate) => {
      return await db.sql`SELECT * FROM exchangeRateValues WHERE dailyExchangeRateId = ${dailyExchangeRate.id}`
    },

    findForRates: async (ids) => {
      return await db.sql`SELECT * FROM exchangeRateValues WHERE dailyExchangeRateId IN ${db.sql(
        ids
      )}`
    }
  }
})
