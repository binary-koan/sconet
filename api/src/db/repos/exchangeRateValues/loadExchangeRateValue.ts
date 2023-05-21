import { ExchangeRateValueRecord } from "../../records/exchangeRateValue"

export function loadExchangeRateValue(row: any): ExchangeRateValueRecord {
  return {
    id: row.id,
    dailyExchangeRateId: row.dailyExchangeRateId,
    toCurrencyId: row.toCurrencyId,
    rate: row.rate,

    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt
  }
}
