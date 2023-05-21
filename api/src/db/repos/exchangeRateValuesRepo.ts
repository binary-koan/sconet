import { DailyExchangeRate } from "../../resolvers-types"
import { sql } from "../database"
import { ExchangeRateValueRecord } from "../records/exchangeRateValue"
import { createRepo } from "../repo"

interface ExchangeRateValueMethods {
  findForRate: (
    dailyExchangeRate: Pick<DailyExchangeRate, "id">
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
