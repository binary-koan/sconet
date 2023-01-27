import { DailyExchangeRateRecord } from "../../records/dailyExchangeRate"
import { loadDate } from "../../utils"

export function loadDailyExchangeRate(row: any): DailyExchangeRateRecord {
  return {
    id: row.id,
    fromCurrencyId: row.fromCurrencyId,
    toCurrencyId: row.toCurrencyId,
    rate: row.rate,
    date: loadDate(row.date as number),

    createdAt: loadDate(row.createdAt as number),
    updatedAt: loadDate(row.updatedAt as number),
    deletedAt: loadDate(row.deletedAt as number)
  }
}
