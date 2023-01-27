import { MakeOptional } from "../../types"
import { startOfDayUTC } from "../../utils/date"
import { db } from "../database"
import { DailyExchangeRateRecord } from "../records/dailyExchangeRate"
import { createRepo } from "../repo"
import { serializeDate } from "../utils"
import { loadDailyExchangeRate } from "./dailyExchangeRates/loadDailyExchangeRate"
import { serializeDailyExchangeRate } from "./dailyExchangeRates/serializeDailyExchangeRate"

export type DailyExchangeRateForInsert = MakeOptional<
  Omit<DailyExchangeRateRecord, "id">,
  "createdAt" | "updatedAt" | "deletedAt"
>

export const dailyExchangeRatesRepo = createRepo({
  tableName: "dailyExchangeRates",
  defaultOrder: { date: "ASC" },
  load: loadDailyExchangeRate,
  serialize: serializeDailyExchangeRate,

  formatForInsert: (dailyExchangeRate: DailyExchangeRateForInsert) => dailyExchangeRate,

  methods: {
    findForDay: (date: Date) => {
      return db
        .query("SELECT * FROM dailyExchangeRates WHERE date = ?")
        .all(serializeDate(startOfDayUTC(date)))
        .map(loadDailyExchangeRate)
    }
  }
})
