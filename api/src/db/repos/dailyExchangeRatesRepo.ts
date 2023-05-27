import { DailyExchangeRateRecord } from "../records/dailyExchangeRate"
import { createRepo } from "../repo"

export const dailyExchangeRatesRepo = createRepo<DailyExchangeRateRecord, Record<string, never>>({
  tableName: "dailyExchangeRates",
  defaultOrder: { date: "ASC" },
  methods: {}
})
