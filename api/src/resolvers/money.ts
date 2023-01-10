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
  options: MoneyOptions & { targetCurrencyCode?: string | null; context: Context }
): Promise<MoneyOptions> => {
  if (!options.targetCurrencyCode) {
    return { amount: options.amount, currency: options.currency }
  }

  const { rate, toId } = await options.context.data.exchangeRate.load({
    from: options.currency.code,
    to: options.targetCurrencyCode
  })

  const otherCurrency = await options.context.data.currency.load(toId)

  return {
    amount: convertAmount(options.amount, options.currency, rate),
    currency: otherCurrency
  }
}

export const sumCurrency = async (options: {
  amounts: MoneyOptions[]
  targetCurrencyCode?: string | null
  context: Context
}): Promise<MoneyOptions> => {
  if (!options.amounts.length) {
    return {
      amount: 0,
      currency: await options.context.data.currency.load(options.context.defaultCurrencyId)
    }
  }

  const targetCurrencyCode =
    options.targetCurrencyCode ||
    (await options.context.data.currency.load(options.context.defaultCurrencyId)).code

  const rates = await options.context.data.exchangeRate.loadMany(
    options.amounts.map(({ currency }) => ({
      from: currency.code,
      to: targetCurrencyCode
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
      return convertAmount(amount, currency, rate.rate)
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

export const convertAmount = (amount: number, currency: CurrencyRecord, exchangeRate: number) => {
  return decimalAmount({ amount, currency }) * exchangeRate
}

const decimalAmount = ({ amount, currency }: MoneyOptions) => {
  if (amount === 0) return 0

  return amount / 10 ** currency.decimalDigits
}

export const Money: Resolvers["Money"] = {
  formatted: (options) => {
    const formattedValue = Math.abs(decimalAmount(options)).toFixed(options.currency.decimalDigits)

    return `${options.amount < 0 ? "-" : ""}${options.currency.symbol}${formattedValue}`
  },
  integerAmount: (options) => options.amount,
  decimalAmount: (options) => decimalAmount(options)
}
