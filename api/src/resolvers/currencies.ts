import { difference, union } from "lodash"
import { Currencies } from "ts-money"
import { usersRepo } from "../db/repos/usersRepo"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"

export const currencies: QueryResolvers["currencies"] = () => {
  return Object.values(currencies)
}

export const currency: QueryResolvers["currency"] = async (_, { code }) => {
  return Currencies[code] || null
}

export const favoriteCurrency: MutationResolvers["favoriteCurrency"] = async (
  _,
  { code },
  context
) => {
  await usersRepo.updateOne(context.currentUser!.id, {
    settings: {
      ...context.currentUser!.settings,
      favoriteCurrencyCodes: union(context.currentUser!.settings.favoriteCurrencyCodes, [code])
    }
  })

  return Currencies[code]
}

export const unfavoriteCurrency: MutationResolvers["unfavoriteCurrency"] = async (
  _,
  { code },
  context
) => {
  await usersRepo.updateOne(context.currentUser!.id, {
    settings: {
      ...context.currentUser!.settings,
      favoriteCurrencyCodes: difference(context.currentUser!.settings.favoriteCurrencyCodes, [code])
    }
  })

  return Currencies[code]
}

export const Currency: Resolvers["Currency"] = {
  id: (currency) => currency.code,
  code: (currency) => currency.code,
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
