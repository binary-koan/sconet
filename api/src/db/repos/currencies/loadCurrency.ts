import { CurrencyRecord } from "../../records/currency"

export function loadCurrency(row: any): CurrencyRecord {
  return {
    id: row.id,
    code: row.code,
    symbol: row.symbol,
    decimalDigits: row.decimalDigits,

    deletedAt: row.deletedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}
