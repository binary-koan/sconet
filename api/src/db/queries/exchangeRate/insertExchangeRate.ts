import { db } from "../../database"
import ObjectID from "bson-objectid"
import { MakeOptional } from "../../../types"
import { serializeDate } from "../../utils"
import { ExchangeRateRecord } from "../../records/exchangeRate"

export type ExchangeRateForInsert = MakeOptional<
  Omit<ExchangeRateRecord, "id">,
  "deletedAt" | "createdAt" | "updatedAt"
>

export function insertExchangeRate(exchangeRate: ExchangeRateForInsert) {
  const id = ObjectID().toHexString()

  db.run(
    `
    INSERT INTO exchangeRates
      (id, fromCurrencyId, toCurrencyId, rate, deletedAt, createdAt, updatedAt)
    VALUES
      ($id, $fromCurrencyId, $toCurrencyId, $rate, $deletedAt, $createdAt, $updatedAt)
  `,
    {
      $id: id,
      $fromCurrencyId: exchangeRate.fromCurrencyId,
      $toCurrencyId: exchangeRate.toCurrencyId,
      $rate: exchangeRate.rate,
      $deletedAt: serializeDate(exchangeRate.deletedAt),
      $createdAt: serializeDate(exchangeRate.createdAt || new Date()),
      $updatedAt: serializeDate(exchangeRate.updatedAt || new Date())
    }
  )

  return id
}
