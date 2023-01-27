import { dailyExchangeRatesRepo } from "../db/repos/dailyExchangeRatesRepo"
import { exchangeRateValuesRepo } from "../db/repos/exchangeRateValuesRepo"
import { QueryResolvers, Resolvers } from "../resolvers-types"
import { startOfDayUTC } from "../utils/date"

export const currentExchangeRates: QueryResolvers["currentExchangeRates"] = () => {
  return dailyExchangeRatesRepo.findForDay(startOfDayUTC())
}

export const DailyExchangeRate: Resolvers["DailyExchangeRate"] = {
  id: (dailyExchangeRate) => dailyExchangeRate.id,
  fromCurrencyId: (dailyExchangeRate) => dailyExchangeRate.fromCurrencyId,
  fromCurrency: (dailyExchangeRate, _, context) =>
    context.data.currency.load(dailyExchangeRate.fromCurrencyId),
  date: (dailyExchangeRate) => dailyExchangeRate.date,
  rates: (dailyExchangeRate) => exchangeRateValuesRepo.findForRate(dailyExchangeRate)
}

export const ExchangeRateValue: Resolvers["ExchangeRateValue"] = {
  id: (exchangeRateValue) => exchangeRateValue.id,
  toCurrencyId: (exchangeRateValue) => exchangeRateValue.toCurrencyId,
  toCurrency: (exchangeRateValue, _, context) =>
    context.data.currency.load(exchangeRateValue.toCurrencyId),
  rate: (exchangeRateValue) => exchangeRateValue.rate
}
