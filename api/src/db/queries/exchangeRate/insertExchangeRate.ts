import ObjectID from "bson-objectid"
import { MakeOptional } from "../../../types"
import { db } from "../../database"
import { ExchangeRateRecord } from "../../records/exchangeRate"
import { serializeDate } from "../../utils"

export type ExchangeRateForInsert = MakeOptional<
  Omit<ExchangeRateRecord, "id">,
  "deletedAt" | "createdAt" | "updatedAt"
>

export function insertExchangeRate(exchangeRate: ExchangeRateForInsert) {
  const id = ObjectID().toHexString()

  db.query(
    `
    INSERT INTO exchangeRates
      (id, fromCurrencyId, toCurrencyId, rate, deletedAt, createdAt, updatedAt)
    VALUES
      ($id, $fromCurrencyId, $toCurrencyId, $rate, $deletedAt, $createdAt, $updatedAt)
  `
  ).run({
    $id: id,
    $fromCurrencyId: exchangeRate.fromCurrencyId,
    $toCurrencyId: exchangeRate.toCurrencyId,
    $rate: exchangeRate.rate,
    $deletedAt: serializeDate(exchangeRate.deletedAt),
    $createdAt: serializeDate(exchangeRate.createdAt || new Date()),
    $updatedAt: serializeDate(exchangeRate.updatedAt || new Date())
  })

  return id
}
