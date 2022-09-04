import { db } from "../../database"
import { serializeDate } from "../../utils"

export function softDeleteCurrency(id: string) {
  db.run(`UPDATE currencies SET deletedAt = $now WHERE id = $id`, {
    $id: id,
    $now: serializeDate(new Date())
  })

  db.run(`UPDATE exchangeRates SET deletedAt = $now WHERE fromCurrencyId = $id`, {
    $id: id,
    $now: serializeDate(new Date())
  })

  db.run(`UPDATE exchangeRates SET deletedAt = $now WHERE toCurrencyId = $id`, {
    $id: id,
    $now: serializeDate(new Date())
  })

  db.run(`UPDATE transactions SET deletedAt = $now WHERE currencyId = $id`, {
    $id: id,
    $now: serializeDate(new Date())
  })

  db.run(
    `UPDATE categories SET budget = NULL, budgetCurrencyId = NULL WHERE budgetCurrencyId = $id`,
    {
      $id: id
    }
  )

  return id
}
