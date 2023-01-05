import { insertExchangeRate } from "../db/queries/exchangeRate/insertExchangeRate"
import { CurrencyRecord } from "../db/records/currency"
import { currenciesRepo } from "../db/repos/currenciesRepo"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"

export const currencies: QueryResolvers["currencies"] = () => {
  return currenciesRepo.findAll()
}

export const currency: QueryResolvers["currency"] = (_, { id }) => {
  return currenciesRepo.get(id) || null
}

export const createCurrency: MutationResolvers["createCurrency"] = async (_, { input }) => {
  const id = currenciesRepo.insert(input)

  const allCurrencies = currenciesRepo.findAll()
  const newCurrency = allCurrencies.find((currency) => currency.id === id)!

  await Promise.all(
    allCurrencies.map(async (currency) => {
      if (currency.id === newCurrency.id) return

      const response = await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency.code.toLowerCase()}/${input.code.toLowerCase()}.json`
      )
      const data: any = await response.json()

      insertExchangeRate({
        fromCurrencyId: currency.id,
        toCurrencyId: newCurrency.id,
        rate: data[input.code.toLowerCase()]
      })

      insertExchangeRate({
        fromCurrencyId: newCurrency.id,
        toCurrencyId: currency.id,
        rate: 1 / data[input.code.toLowerCase()]
      })
    })
  )

  return newCurrency
}

export const updateCurrency: MutationResolvers["updateCurrency"] = (_, { id, input }) => {
  const currency = currenciesRepo.get(id)

  if (!currency) {
    throw new Error("Not found")
  }

  const updates: Partial<CurrencyRecord> = input

  currenciesRepo.updateOne(id, updates)

  return currenciesRepo.get(id)!
}

export const deleteCurrency: MutationResolvers["deleteCurrency"] = (_, { id }) => {
  const currency = currenciesRepo.get(id)

  if (!currency) {
    throw new Error("Not found")
  }

  currenciesRepo.softDelete(id)

  return currency
}

export const Currency: Resolvers["Currency"] = {
  id: (currency) => currency.id,
  code: (currency) => currency.code,
  symbol: (currency) => currency.symbol,
  decimalDigits: (currency) => currency.decimalDigits,

  exchangeRate: async (currency, { to }, context) =>
    (await context.data.exchangeRate.load({ from: currency.code, to })).rate
}
