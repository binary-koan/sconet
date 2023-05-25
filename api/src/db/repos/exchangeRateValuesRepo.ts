import { sql } from "../database"
import { DailyExchangeRateRecord } from "../records/dailyExchangeRate"
import { ExchangeRateValueRecord } from "../records/exchangeRateValue"
import { createRepo } from "../repo"

interface ExchangeRateValueMethods {
  findForRate: (
    dailyExchangeRate: Pick<DailyExchangeRateRecord, "id">
  ) => Promise<ExchangeRateValueRecord[]>
  findForRates: (ids: string[]) => Promise<ExchangeRateValueRecord[]>
}

export const exchangeRateValuesRepo = createRepo<ExchangeRateValueRecord, ExchangeRateValueMethods>(
  {
    tableName: "exchangeRateValues",
    defaultOrder: { id: "ASC" },

    methods: {
      findForRate: async (dailyExchangeRate) => {
        return await sql`SELECT * FROM exchangeRateValues WHERE dailyExchangeRateId = ${dailyExchangeRate.id}`
      },

      findForRates: async (ids) => {
        return await sql`SELECT * FROM exchangeRateValues WHERE dailyExchangeRateId IN ${sql(ids)}`
      }
    }
  }
)
