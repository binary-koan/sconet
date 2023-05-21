import { MakeOptional } from "../../types"
import { startOfDayUTC } from "../../utils/date"
import { sql } from "../database"
import { DailyExchangeRateRecord } from "../records/dailyExchangeRate"
import { createRepo } from "../repo"
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
    findForDay: async (date: Date) => {
      return (
        await sql`SELECT * FROM "dailyExchangeRates" WHERE "date" = ${startOfDayUTC(date)}`
      ).map(loadDailyExchangeRate)
    },

    findClosest: async (date: Date, fromCurrencyId: string) => {
      const onOrAfter = loadDailyExchangeRate(
        (
          await sql`SELECT * FROM "dailyExchangeRates" WHERE "date" >= ${startOfDayUTC(
            date
          )} AND fromCurrencyId = ${fromCurrencyId} ORDER BY "date" ASC`
        )[0]
      )

      if (onOrAfter?.date?.getTime() === date.getTime()) {
        return loadDailyExchangeRate(onOrAfter)
      }

      const before = loadDailyExchangeRate(
        await sql`SELECT * FROM "dailyExchangeRates" WHERE "date" < ${startOfDayUTC(
          date
        )} AND "fromCurrencyId" = ${fromCurrencyId} ORDER BY "date" DESC`
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
