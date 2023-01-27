import { dailyExchangeRatesRepo } from "../db/repos/dailyExchangeRatesRepo"
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
  toCurrencyId: (dailyExchangeRate) => dailyExchangeRate.toCurrencyId,
  toCurrency: (dailyExchangeRate, _, context) =>
    context.data.currency.load(dailyExchangeRate.toCurrencyId),
  rate: (dailyExchangeRate) => dailyExchangeRate.rate,
  date: (dailyExchangeRate) => dailyExchangeRate.date
}
