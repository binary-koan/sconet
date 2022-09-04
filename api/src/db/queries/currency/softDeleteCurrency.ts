import { db } from "../../database"

export function softDeleteCurrency(id: string) {
  db.run(`UPDATE currencies SET deletedAt = $now WHERE id = $id`, {
    $id: id,
    $now: new Date().getTime()
  })

  db.run(`UPDATE exchangeRates SET deletedAt = $now WHERE fromCurrencyId = $id`, {
    $id: id,
    $now: new Date().getTime()
  })

  db.run(`UPDATE exchangeRates SET deletedAt = $now WHERE toCurrencyId = $id`, {
    $id: id,
    $now: new Date().getTime()
  })

  return id
}
