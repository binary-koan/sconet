import { startOfDayUTC } from "../../utils/date"
import { sql } from "../database"
import { DailyExchangeRateRecord } from "../records/dailyExchangeRate"
import { createRepo } from "../repo"

interface DailyExchangeRateMethods {
  findForDay: (date: Date) => Promise<DailyExchangeRateRecord[]>
  findClosest: (date: Date, fromCurrencyId: string) => Promise<DailyExchangeRateRecord | null>
}

export const dailyExchangeRatesRepo = createRepo<DailyExchangeRateRecord, DailyExchangeRateMethods>(
  {
    tableName: "dailyExchangeRates",
    defaultOrder: { date: "ASC" },

    methods: {
      findForDay: async (date) => {
        return await sql<
          DailyExchangeRateRecord[]
        >`SELECT * FROM "dailyExchangeRates" WHERE "date" = ${startOfDayUTC(date)}`
      },

      findClosest: async (date, fromCurrencyId) => {
        const onOrAfter = (
          await sql<
            DailyExchangeRateRecord[]
          >`SELECT * FROM "dailyExchangeRates" WHERE "date" >= ${startOfDayUTC(
            date
          )} AND fromCurrencyId = ${fromCurrencyId} ORDER BY "date" ASC`
        )[0]

        if (onOrAfter?.date?.getTime() === date.getTime()) {
          return onOrAfter
        }

        const before = (
          await sql<
            DailyExchangeRateRecord[]
          >`SELECT * FROM "dailyExchangeRates" WHERE "date" < ${startOfDayUTC(
            date
          )} AND "fromCurrencyId" = ${fromCurrencyId} ORDER BY "date" DESC`
        )[0]

        if (!before && !onOrAfter) {
          return null
        }

        if (!onOrAfter) {
          return before
        }

        if (!before) {
          return onOrAfter
        }

        const differenceAfter = onOrAfter.date.getTime() - date.getTime()
        const differenceBefore = date.getTime() - before.date.getTime()

        if (differenceAfter > differenceBefore) {
          return before
        } else {
          return onOrAfter
        }
      }
    }
  }
)
