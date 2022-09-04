import { db } from "../../database"
import { loadCurrency } from "./loadCurrency"
import { CurrencyRecord } from "../../records/currency"

export function getCurrency(id: string): CurrencyRecord | undefined {
  const result = db.query("SELECT * FROM currencies WHERE id = ?").get(id)

  return result && loadCurrency(result)
}
