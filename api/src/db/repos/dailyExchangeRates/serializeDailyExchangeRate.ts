import { DailyExchangeRateRecord } from "../../records/dailyExchangeRate"
import { serializeDate } from "../../utils"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeDailyExchangeRate(dailyExchangeRate: Partial<DailyExchangeRateRecord>) {
  return serializePartialRecord(dailyExchangeRate, {
    date: serializeDate,
    createdAt: serializeDate,
    updatedAt: serializeDate
  })
}
