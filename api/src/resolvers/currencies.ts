import { CurrencyRecord } from "../db/records/currency"
import { findCurrencies } from "../db/queries/currency/findCurrencies"
import { getCurrency } from "../db/queries/currency/getCurrency"
import { insertCurrency } from "../db/queries/currency/insertCurrency"
import { softDeleteCurrency } from "../db/queries/currency/softDeleteCurrency"
import { updateOneCurrency } from "../db/queries/currency/updateOneCurrency"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"
import { insertExchangeRate } from "../db/queries/exchangeRate/insertExchangeRate"

export const currencies: QueryResolvers["currencies"] = () => {
  console.log("currencies", findCurrencies()[0].symbol.codePointAt(0), "¥".codePointAt(0))

  console.log(Buffer.from(findCurrencies()[0].symbol, "utf-8").toString("utf-8"))

  return findCurrencies()
}

export const currency: QueryResolvers["currency"] = (_, { id }) => {
  return getCurrency(id) || null
}

export const createCurrency: MutationResolvers["createCurrency"] = async (_, { input }) => {
  const id = insertCurrency(input)

  const allCurrencies = findCurrencies()
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
  const currency = getCurrency(id)

  if (!currency) {
    throw new Error("Not found")
  }

  const updates: Partial<CurrencyRecord> = input

  updateOneCurrency(id, updates)

  return getCurrency(id)!
}

export const deleteCurrency: MutationResolvers["deleteCurrency"] = (_, { id }) => {
  const currency = getCurrency(id)

  if (!currency) {
    throw new Error("Not found")
  }

  softDeleteCurrency(id)

  return currency
}

export const Currency: Resolvers["Currency"] = {
  id: (currency) => currency.id,
  code: (currency) => currency.code,
  symbol: (currency) => {
    console.log("resolving symbol", currency.symbol)
    return currency.symbol
  },
  decimalDigits: (currency) => currency.decimalDigits,

  exchangeRate: (currency, { to }, context) =>
    context.data.exchangeRate.load({ from: currency.code, to })
}
