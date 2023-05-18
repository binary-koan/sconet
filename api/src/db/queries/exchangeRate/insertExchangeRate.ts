import ObjectID from "bson-objectid"
import { MakeOptional } from "../../../types"
import { sql } from "../../database"
import { ExchangeRateRecord } from "../../records/exchangeRate"

export type ExchangeRateForInsert = MakeOptional<
  Omit<ExchangeRateRecord, "id">,
  "deletedAt" | "createdAt" | "updatedAt"
>

export async function insertExchangeRate(exchangeRate: ExchangeRateForInsert) {
  const id = ObjectID().toHexString()

  await sql`INSERT INTO exchangeRates ${sql({ id, ...exchangeRate })}`

  return id
}
