import { CurrencyRecord } from "../../records/currency"
import { loadDate } from "../../utils"

export function loadCurrency(row: any): CurrencyRecord {
  console.log(row, row.symbol, Buffer.from(row.symbol), Buffer.from(row.symbol).toString("utf-8"))

  return {
    id: row.id,
    code: row.code,
    symbol: Buffer.from(row.symbol).toString("utf-8"),
    decimalDigits: row.decimalDigits,

    deletedAt: loadDate(row.deletedAt),
    createdAt: loadDate(row.createdAt as number),
    updatedAt: loadDate(row.updatedAt as number)
  }
}
