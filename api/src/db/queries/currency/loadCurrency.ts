import { CurrencyRecord } from "../../records/currency"
import { loadDate } from "../../utils"

export function loadCurrency(row: any): CurrencyRecord {
  return {
    id: row.id,
    code: row.code,
    symbol: row.symbol,
    decimalDigits: row.decimalDigits,

    deletedAt: loadDate(row.deletedAt),
    createdAt: loadDate(row.createdAt as number),
    updatedAt: loadDate(row.updatedAt as number)
  }
}
