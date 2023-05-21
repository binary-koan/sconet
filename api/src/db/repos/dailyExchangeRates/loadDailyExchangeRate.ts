import { DailyExchangeRateRecord } from "../../records/dailyExchangeRate"

export function loadDailyExchangeRate(row: any): DailyExchangeRateRecord {
  return {
    id: row.id,
    fromCurrencyId: row.fromCurrencyId,
    date: row.date,

    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt
  }
}
