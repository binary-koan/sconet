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
  options: MoneyOptions & { targetCurrencyId?: string | null; context: Context }
): Promise<MoneyOptions> => {
  if (!options.targetCurrencyId) {
    return { amount: options.amount, currency: options.currency }
  }

  const { rate, toId } = await options.context.data.exchangeRate.load({
    from: options.currency.id,
    to: options.targetCurrencyId
  })

  const otherCurrency = await options.context.data.currency.load(toId)

  return {
    amount: convertAmount(options.amount, options.currency, otherCurrency, rate),
    currency: otherCurrency
  }
}

export const sumCurrency = async (options: {
  amounts: MoneyOptions[]
  targetCurrencyId?: string | null
  context: Context
}): Promise<MoneyOptions> => {
  if (!options.amounts.length) {
    return {
      amount: 0,
      currency: await options.context.data.currency.load(options.context.defaultCurrencyId)
    }
  }

  const targetCurrency = await options.context.data.currency.load(
    options.targetCurrencyId || options.context.defaultCurrencyId
  )

  const rates = await options.context.data.exchangeRate.loadMany(
    options.amounts.map(({ currency }) => ({
      from: currency.id,
      to: targetCurrency.id
    }))
  )

  if (rates.some((rate) => isError(rate))) {
    throw new GraphQLError(`Error fetching exchange rates: ${JSON.stringify(rates)}`)
  }

  const total = sum(
    options.amounts.map(({ amount, currency }, index) => {
      const rate = rates[index]

      if (isError(rate)) {
        throw new GraphQLError(
          `Error fetching exchange rate for ${amount} in ${currency.code}: ${rate}`
        )
      }
      return convertAmount(amount, currency, targetCurrency, rate.rate)
    })
  )

  const otherCurrency = await options.context.data.currency.load(
    (rates[0] as { toId: string }).toId
  )

  return {
    amount: total,
    currency: otherCurrency
  }
}

export const convertAmount = (
  amount: number,
  originalCurrency: CurrencyRecord,
  convertedCurrency: CurrencyRecord,
  exchangeRate: number
) => {
  const convertedDecimal = decimalAmount({ amount, currency: originalCurrency }) * exchangeRate

  return convertedDecimal * 10 ** convertedCurrency.decimalDigits
}

const decimalAmount = ({ amount, currency }: MoneyOptions) => {
  if (amount === 0) return 0

  return amount / 10 ** currency.decimalDigits
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

  integerAmount: (options) => options.amount,
  decimalAmount: (options) => decimalAmount(options)
}
