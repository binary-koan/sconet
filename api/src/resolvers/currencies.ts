import { Currencies } from "ts-money"
import { QueryResolvers, Resolvers } from "../resolvers-types"

export const currencies: QueryResolvers["currencies"] = () => {
  return Object.values(Currencies)
}

export const currency: QueryResolvers["currency"] = async (_, { code }) => {
  return Currencies[code] || null
}

export const Currency: Resolvers["Currency"] = {
  code: (currency) => currency.code,
  name: (currency) => currency.name,
  symbol: (currency) => currency.symbol,
  decimalDigits: (currency) => currency.decimal_digits,

  exchangeRate: async (currency, { toCode }, context) =>
    (
      await context.data.exchangeRates.load({
        fromCurrencyCode: currency.code,
        toCurrencyCode: toCode,
        date: new Date()
      })
    ).rate
}
