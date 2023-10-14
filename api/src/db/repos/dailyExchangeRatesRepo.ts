import { DailyExchangeRateRecord } from "../records/dailyExchangeRate"
import { createRepo } from "../repo"

export const dailyExchangeRatesRepo = createRepo<DailyExchangeRateRecord>({
  tableName: "dailyExchangeRates",
  defaultOrder: { date: "ASC" },
  methods: {},
  asyncMethods: {}
})
