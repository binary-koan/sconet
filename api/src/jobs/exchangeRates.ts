import { currenciesRepo } from "../db/repos/currenciesRepo"
import { dailyExchangeRatesRepo } from "../db/repos/dailyExchangeRatesRepo"
import { startOfDayUTC } from "../utils/date"

export const startExchangeRateSchedule = () => setInterval(updateExchangeRates, 30 * 60 * 1000)

export const updateExchangeRates = async () => {
  const today = startOfDayUTC()
  const currencies = currenciesRepo.findAll()
  const dailyExchangeRates = dailyExchangeRatesRepo.findForDay(today)

  const currenciesMissingExchangeRate = currencies.filter(
    (currency) =>
      !dailyExchangeRates.some((exchangeRate) => exchangeRate.fromCurrencyId === currency.id)
  )

  for (const currency of currenciesMissingExchangeRate) {
    for (const other of currencies.filter((other) => other.id !== currency.id)) {
      const response = await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency.code.toLowerCase()}.json`
      )
      const data: any = await response.json()

      dailyExchangeRatesRepo.insert({
        date: today,
        fromCurrencyId: currency.id,
        toCurrencyId: other.id,
        rate: data[currency.code.toLowerCase()][other.code.toLowerCase()]
      })
    }
  }
}
