import { MakeOptional } from "../../../types"
import { sql } from "../../database"
import { ExchangeRateRecord } from "../../records/exchangeRate"

export type ExchangeRateForInsert = MakeOptional<
  Omit<ExchangeRateRecord, "id">,
  "deletedAt" | "createdAt" | "updatedAt"
>

export async function findExchangeRatesByCurrencyIds(
  queries: ReadonlyArray<{ from: string; to: string }>
): Promise<Array<{ rate: number; fromId: string; toId: string }>> {
  if (!queries.length) {
    return []
  }

  const allRates =
    await sql`SELECT * FROM exchangeRates WHERE deletedAt IS NULL AND fromCurrencyId IN ${sql(
      queries.map(({ from }) => from)
    )}`

  return queries.map(({ from, to }) => {
    if (from === to) {
      return {
        fromId: from,
        toId: to,
        rate: 1
      }
    }

    return {
      fromId: from,
      toId: to,
      rate: allRates.find((rate) => rate.fromCurrencyId === from && rate.toCurrencyId === to)!.rate
    }
  })
}
