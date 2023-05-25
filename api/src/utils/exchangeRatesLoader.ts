import DataLoader from "dataloader"
import { groupBy, isEqual, uniqWith } from "lodash"
import { sql } from "../db/database"
import { dailyExchangeRatesRepo } from "../db/repos/dailyExchangeRatesRepo"
import { exchangeRateValuesRepo } from "../db/repos/exchangeRateValuesRepo"
import { startOfDayUTC } from "./date"

export interface ExchangeRateIdentifier {
  fromCurrencyCode: string
  toCurrencyCode: string
  date: Date
}

export type ExchangeRatesLoader = DataLoader<ExchangeRateIdentifier, ResolvedExchangeRate>

export interface ResolvedExchangeRate {
  fromCurrencyCode: string
  toCurrencyCode: string
  date: Date
  rate: number
}

export function exchangeRatesLoader(): ExchangeRatesLoader {
  return new DataLoader(async (toLoad: readonly ExchangeRateIdentifier[]) => {
    if (toLoad.some(({ date }) => date > new Date())) {
      throw new Error("Cannot load exchange rates for future dates")
    }

    const neededExchangeRates = buildNeededRates(toLoad)

    const mapping = new ExchangeRateMap()

    const existingExchangeRates = await fetchExistingRates(neededExchangeRates)

    const missingExchangeRates = neededExchangeRates.filter(
      (neededExchangeRate) =>
        !existingExchangeRates.some((existingExchangeRate) =>
          isEqual(existingExchangeRate, neededExchangeRate)
        )
    )

    await fetchAllRates(missingExchangeRates, mapping)
    await saveRates(mapping)

    mapping.add(...existingExchangeRates)

    return toLoad.map(({ fromCurrencyCode, toCurrencyCode, date }) => {
      if (fromCurrencyCode === toCurrencyCode) {
        return {
          fromCurrencyCode,
          toCurrencyCode,
          date,
          rate: 1
        }
      }

      return mapping.get(fromCurrencyCode, toCurrencyCode, date)
    })
  })
}

function buildNeededRates(
  amountsForConversion: readonly ExchangeRateIdentifier[]
): ExchangeRateIdentifier[] {
  return uniqWith(
    amountsForConversion
      .filter(({ fromCurrencyCode, toCurrencyCode }) => fromCurrencyCode !== toCurrencyCode)
      .map(({ fromCurrencyCode, toCurrencyCode, date }) => ({
        fromCurrencyCode,
        toCurrencyCode,
        date: startOfDayUTC(date)
      })),
    isEqual
  )
}

async function fetchExistingRates(neededExchangeRates: ExchangeRateIdentifier[]) {
  return await sql<Array<ResolvedExchangeRate>>`
      SELECT "fromCurrencyCode", "toCurrencyCode", "date", "rate" FROM "dailyExchangeRates"
      INNER JOIN "exchangeRateValues" ON "dailyExchangeRates"."id" = "exchangeRateValues"."dailyExchangeRateId"
      WHERE ("fromCurrencyCode", "toCurrencyCode", "date") IN ${sql(neededExchangeRates)}
    `
}

async function fetchAllRates(exchangeRates: ExchangeRateIdentifier[], mapping: ExchangeRateMap) {
  const groups = groupBy(
    exchangeRates,
    ({ fromCurrencyCode, date }) => date.toISOString().split("T")[0] + "_" + fromCurrencyCode
  )

  for (const group of Object.values(groups)) {
    const [{ fromCurrencyCode, date }] = group

    let data

    try {
      data = await fetchExchangeRates(fromCurrencyCode, date.toISOString().split("T")[0])
    } catch (e) {
      data = await fetchExchangeRates(fromCurrencyCode, "latest")
    }

    for (const { fromCurrencyCode, toCurrencyCode, date } of group) {
      if (!data[fromCurrencyCode][toCurrencyCode]) {
        throw new Error(
          `No exchange rate exists for ${fromCurrencyCode} to ${toCurrencyCode} on ${date}`
        )
      }

      mapping.add({
        fromCurrencyCode,
        toCurrencyCode,
        date,
        rate: data[fromCurrencyCode][toCurrencyCode]
      })
    }
  }
}

async function fetchExchangeRates(
  fromCurrencyCode: string,
  date: string
): Promise<{ [from: string]: { [to: string]: number } }> {
  const response = await fetch(
    `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${date}/currencies/${fromCurrencyCode.toLowerCase()}.json`
  )
  return await response.json()
}

async function saveRates(mapping: ExchangeRateMap) {
  await sql.begin(async (sql) => {
    const dailyRates = await dailyExchangeRatesRepo.insertAll(
      mapping.values().map(({ fromCurrencyCode, date }) => ({
        fromCurrencyCode,
        date
      })),
      sql
    )

    await exchangeRateValuesRepo.insertAll(
      mapping.values().map(({ fromCurrencyCode, toCurrencyCode, date, rate }) => ({
        dailyExchangeRateId: dailyRates.find(
          (dailyRate) => dailyRate.fromCurrencyCode === fromCurrencyCode && dailyRate.date === date
        )!.id,
        toCurrencyCode,
        rate
      })),
      sql
    )
  })
}

class ExchangeRateMap {
  private map = new Map<string, ResolvedExchangeRate>()

  add(...values: ResolvedExchangeRate[]) {
    values.forEach((value) =>
      this.map.set(
        `${value.fromCurrencyCode}_${value.toCurrencyCode}_${value.date.toISOString()}`,
        value
      )
    )
  }

  get(fromCurrencyCode: string, toCurrencyCode: string, date: Date) {
    const value = this.map.get(`${fromCurrencyCode}_${toCurrencyCode}_${date.toISOString()}`)

    if (!value) {
      throw new Error(
        `No exchange rate loaded into mapping for ${fromCurrencyCode} to ${toCurrencyCode} on ${date}`
      )
    }

    return value
  }

  values() {
    return [...this.map.values()]
  }
}
