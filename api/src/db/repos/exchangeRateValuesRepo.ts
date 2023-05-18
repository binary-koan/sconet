import { DailyExchangeRate } from "../../resolvers-types"
import { MakeOptional } from "../../types"
import { sql } from "../database"
import { ExchangeRateValueRecord } from "../records/exchangeRateValue"
import { createRepo } from "../repo"
import { loadExchangeRateValue } from "./exchangeRateValues/loadExchangeRateValue"
import { serializeExchangeRateValue } from "./exchangeRateValues/serializeExchangeRateValue"

export type ExchangeRateValueForInsert = MakeOptional<
  Omit<ExchangeRateValueRecord, "id">,
  "createdAt" | "updatedAt" | "deletedAt"
>

export const exchangeRateValuesRepo = createRepo({
  tableName: "exchangeRateValues",
  defaultOrder: { id: "ASC" },
  load: loadExchangeRateValue,
  serialize: serializeExchangeRateValue,

  formatForInsert: (exchangeRateValue: ExchangeRateValueForInsert) => exchangeRateValue,

  methods: {
    findForRate: async (dailyExchangeRate: Pick<DailyExchangeRate, "id">) => {
      return (
        await sql`SELECT * FROM exchangeRateValues WHERE dailyExchangeRateId = ${dailyExchangeRate.id}`
      ).map(loadExchangeRateValue)
    },

    findForRates: async (ids: string[]) => {
      return (
        await sql`SELECT * FROM exchangeRateValues WHERE dailyExchangeRateId IN ${sql(ids)}`
      ).map(loadExchangeRateValue)
    }
  }
})
