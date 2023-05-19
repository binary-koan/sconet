import { insertExchangeRate } from "../db/queries/exchangeRate/insertExchangeRate"
import { CurrencyRecord } from "../db/records/currency"
import { currenciesRepo } from "../db/repos/currenciesRepo"
import { updateExchangeRates } from "../jobs/exchangeRates"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"

export const currencies: QueryResolvers["currencies"] = () => {
  return currenciesRepo.findAll()
}

export const currency: QueryResolvers["currency"] = async (_, { id }) => {
  return (await currenciesRepo.get(id)) || null
}

export const createCurrency: MutationResolvers["createCurrency"] = async (_, { input }) => {
  const newCurrency = await currenciesRepo.insert(input)
  const allCurrencies = await currenciesRepo.findAll()

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

      await updateExchangeRates()
    })
  )

  return newCurrency
}

export const updateCurrency: MutationResolvers["updateCurrency"] = async (_, { id, input }) => {
  const currency = await currenciesRepo.get(id)

  if (!currency) {
    throw new Error("Not found")
  }

  const updates: Partial<CurrencyRecord> = input

  return await currenciesRepo.updateOne(id, updates)
}

export const deleteCurrency: MutationResolvers["deleteCurrency"] = async (_, { id }) => {
  const currency = await currenciesRepo.get(id)

  if (!currency) {
    throw new Error("Not found")
  }

  await currenciesRepo.softDelete(id)

  return currency
}

export const Currency: Resolvers["Currency"] = {
  id: (currency) => currency.id,
  code: (currency) => currency.code,
  symbol: (currency) => currency.symbol,
  decimalDigits: (currency) => currency.decimalDigits,

  exchangeRate: async (currency, { toId }, context) =>
    (
      await context.data.exchangeRateValue.load({
        dailyExchangeRateId: (
          await context.data.dailyExchangeRate.load({ fromCurrencyId: currency.id })
        ).id,
        toCurrencyId: toId
      })
    ).rate
}
