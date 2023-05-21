import { MakeOptional } from "../../../types"
import { sql } from "../../database"
import { ExchangeRateRecord } from "../../records/exchangeRate"

export type ExchangeRateForInsert = MakeOptional<
  Omit<ExchangeRateRecord, "id">,
  "deletedAt" | "createdAt" | "updatedAt"
>

export async function insertExchangeRate(exchangeRate: ExchangeRateForInsert) {
  const rows = await sql`INSERT INTO exchangeRates ${sql({ ...exchangeRate })} RETURNING *`

  return rows[0].id
}
