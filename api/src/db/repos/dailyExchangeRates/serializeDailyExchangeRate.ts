import { DailyExchangeRateRecord } from "../../records/dailyExchangeRate"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeDailyExchangeRate(dailyExchangeRate: Partial<DailyExchangeRateRecord>) {
  return serializePartialRecord(dailyExchangeRate)
}
