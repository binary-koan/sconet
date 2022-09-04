import { db } from "../../database"
import { loadCurrency } from "./loadCurrency"

export function findCurrencies() {
  return db
    .query(`SELECT * FROM currencies WHERE deletedAt IS NULL ORDER BY code ASC`)
    .all()
    .map(loadCurrency)
}
