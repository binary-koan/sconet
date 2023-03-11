import { DailyExchangeRate } from "../../resolvers-types"
import { MakeOptional } from "../../types"
import { db } from "../database"
import { ExchangeRateValueRecord } from "../records/exchangeRateValue"
import { createRepo } from "../repo"
import { arrayBindings, arrayQuery } from "../utils/fields"
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
    findForRate: (dailyExchangeRate: Pick<DailyExchangeRate, "id">) => {
      return db
        .query("SELECT * FROM exchangeRateValues WHERE dailyExchangeRateId = ?")
        .all(dailyExchangeRate.id)
        .map(loadExchangeRateValue)
    },

    findForRates: (ids: string[]) => {
      return db
        .query(`SELECT * FROM exchangeRateValues WHERE dailyExchangeRateId IN ${arrayQuery(ids)}`)
        .all(arrayBindings(ids))
        .map(loadExchangeRateValue)
    }
  }
})
