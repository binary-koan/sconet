import { sql } from "../db/database"
import { currenciesRepo } from "../db/repos/currenciesRepo"
import { dailyExchangeRatesRepo } from "../db/repos/dailyExchangeRatesRepo"
import { exchangeRateValuesRepo } from "../db/repos/exchangeRateValuesRepo"
import { loadTransaction } from "../db/repos/transactions/loadTransaction"
import { transactionsRepo } from "../db/repos/transactionsRepo"
import { startOfDayUTC } from "../utils/date"

export const startExchangeRateSchedule = () => setInterval(updateExchangeRates, 30 * 60 * 1000)

export const updateExchangeRates = async () => {
  const today = startOfDayUTC()
  const currencies = await currenciesRepo.findAll()
  const dailyExchangeRates = await dailyExchangeRatesRepo.findForDay(today)

  const currenciesMissingExchangeRate = currencies.filter(
    (currency) =>
      !dailyExchangeRates.some((exchangeRate) => exchangeRate.fromCurrencyId === currency.id)
  )

  for (const currency of currenciesMissingExchangeRate) {
    const response = await fetch(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency.code.toLowerCase()}.json`
    )
    const data: any = await response.json()

    const dailyExchangeRate = await dailyExchangeRatesRepo.insert({
      date: today,
      fromCurrencyId: currency.id
    })

    for (const other of currencies.filter((other) => other.id !== currency.id)) {
      await exchangeRateValuesRepo.insert({
        dailyExchangeRateId: dailyExchangeRate.id,
        toCurrencyId: other.id,
        rate: data[currency.code.toLowerCase()][other.code.toLowerCase()]
      })
    }
  }

  const transactionsMissingExchangeRate = (
    await sql`SELECT * FROM "transactions" WHERE "dailyExchangeRateId" IS NULL`
  ).map(loadTransaction)

  for (const transaction of transactionsMissingExchangeRate) {
    await transactionsRepo.updateOne(transaction.id, {
      dailyExchangeRateId: (await dailyExchangeRatesRepo.findClosest(
        transaction.date,
        transaction.currencyId
      ))!.id
    })
  }
}
