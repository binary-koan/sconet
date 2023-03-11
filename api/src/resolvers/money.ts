import { GraphQLError } from "graphql"
import { isError, sum } from "lodash"
import { Context } from "../context"
import { CurrencyRecord } from "../db/records/currency"
import { Resolvers } from "../resolvers-types"

export interface MoneyOptions {
  amount: number
  currency: CurrencyRecord
}

export const convertCurrency = async (
  options: MoneyOptions & {
    target?: { currencyId: string; date?: Date } | null
    context: Context
  }
): Promise<MoneyOptions> => {
  if (!options.target) {
    return { amount: options.amount, currency: options.currency }
  }

  const convertedAmount = await options.context.data.amountInCurrency.load({
    amount: options.amount,
    fromCurrencyId: options.currency.id,
    toCurrencyId: options.target.currencyId,
    dailyExchangeRateId: (
      await options.context.data.dailyExchangeRate.load({
        fromCurrencyId: options.currency.id,
        date: options.target.date
      })
    ).id
  })
  const otherCurrency = await options.context.data.currency.load(options.target.currencyId)

  return {
    amount: convertedAmount,
    currency: otherCurrency
  }
}

export const sumCurrency = async (options: {
  amounts: MoneyOptions[]
  target?: { currencyId: string; date?: Date } | null
  context: Context
}): Promise<MoneyOptions> => {
  if (!options.amounts.length) {
    return {
      amount: 0,
      currency: await options.context.data.currency.load(options.context.defaultCurrencyId)
    }
  }

  const targetCurrency = await options.context.data.currency.load(
    options.target?.currencyId || options.context.defaultCurrencyId
  )

  const convertedAmounts = await options.context.data.amountInCurrency.loadMany(
    await Promise.all(
      options.amounts.map(async ({ amount, currency }) => ({
        amount,
        fromCurrencyId: currency.id,
        toCurrencyId: targetCurrency.id,
        dailyExchangeRateId: (
          await options.context.data.dailyExchangeRate.load({
            fromCurrencyId: targetCurrency.id,
            date: options.target?.date
          })
        ).id
      }))
    )
  )

  if (convertedAmounts.some((amount) => isError(amount))) {
    throw new GraphQLError(`Error fetching converted amounts: ${JSON.stringify(convertedAmounts)}`)
  }

  const total = sum(convertedAmounts)

  return {
    amount: total,
    currency: targetCurrency
  }
}

const decimalAmount = ({ amount, currency }: MoneyOptions) => {
  if (amount === 0) return 0

  return parseFloat((amount / 10 ** currency.decimalDigits).toFixed(currency.decimalDigits))
}

export const Money: Resolvers["Money"] = {
  formatted: (options) => {
    const formattedValue = Math.abs(decimalAmount(options)).toFixed(options.currency.decimalDigits)
    const withCommas = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return `${options.amount < 0 ? "-" : ""}${options.currency.symbol}${withCommas}`
  },

  formattedShort: (options) => {
    const absoluteAmount = Math.round(Math.abs(decimalAmount(options)))
    let amount = absoluteAmount
    let suffix = ""

    if (absoluteAmount > 1_000_000) {
      amount = Math.round(absoluteAmount / 1_000_000)
      suffix = "M"
    } else if (absoluteAmount > 10_000) {
      amount = Math.round(absoluteAmount / 1_000)
      suffix = "K"
    }

    return `${options.amount < 0 ? "-" : ""}${options.currency.symbol}${amount}${suffix}`
  },

  integerAmount: (options) => Math.round(options.amount),
  decimalAmount: (options) => decimalAmount(options)
}
