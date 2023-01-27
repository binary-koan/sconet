import { ExchangeRateValueRecord } from "../../records/exchangeRateValue"
import { loadDate } from "../../utils"

export function loadExchangeRateValue(row: any): ExchangeRateValueRecord {
  return {
    id: row.id,
    dailyExchangeRateId: row.dailyExchangeRateId,
    toCurrencyId: row.toCurrencyId,
    rate: row.rate,

    createdAt: loadDate(row.createdAt as number),
    updatedAt: loadDate(row.updatedAt as number),
    deletedAt: loadDate(row.deletedAt as number)
  }
}
