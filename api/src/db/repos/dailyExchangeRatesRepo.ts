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
    },

    findClosest: (date: Date, fromCurrencyId: string) => {
      const onOrAfter = loadDailyExchangeRate(
        db
          .query(
            "SELECT * FROM dailyExchangeRates WHERE date >= ? AND fromCurrencyId = ? ORDER BY date ASC"
          )
          .get(serializeDate(startOfDayUTC(date)), fromCurrencyId)
      )

      if (onOrAfter?.date?.getTime() === date.getTime()) {
        return loadDailyExchangeRate(onOrAfter)
      }

      const before = loadDailyExchangeRate(
        db
          .query(
            "SELECT * FROM dailyExchangeRates WHERE date < ? AND fromCurrencyId = ? ORDER BY date DESC"
          )
          .get(serializeDate(startOfDayUTC(date)), fromCurrencyId)
      )

      if (!before && !onOrAfter) {
        return null
      }

      if (!onOrAfter) {
        return loadDailyExchangeRate(before)
      }

      if (!before) {
        return loadDailyExchangeRate(onOrAfter)
      }

      const differenceAfter = onOrAfter.date.getTime() - date.getTime()
      const differenceBefore = date.getTime() - before.date.getTime()

      if (differenceAfter > differenceBefore) {
        return loadDailyExchangeRate(before)
      } else {
        return loadDailyExchangeRate(onOrAfter)
      }
    }
  }
})
