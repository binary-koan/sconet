import { GraphQLError } from "graphql"
import { isError } from "lodash"
import { Money as MoneyValue } from "ts-money"
import { Context } from "../context"
import { Resolvers } from "../resolvers-types"

export const sumCurrency = async ({
  amounts,
  target,
  context
}: {
  amounts: MoneyValue[]
  target?: { currencyCode: string; date?: Date } | null
  context: Context
}): Promise<MoneyValue> => {
  const targetCurrencyCode =
    target?.currencyCode || context.currentUser!.settings.defaultCurrencyCode

  if (!amounts.length) {
    return new MoneyValue(0, targetCurrencyCode)
  }

  const convertedAmounts = await context.data.currencyValues.loadMany(
    amounts.map((amount) => ({
      original: amount,
      targetCurrencyCode,
      date: target?.date || new Date()
    }))
  )

  if (convertedAmounts.some((amount) => isError(amount))) {
    throw new GraphQLError(`Error fetching converted amounts: ${JSON.stringify(convertedAmounts)}`)
  }

  return (convertedAmounts as MoneyValue[]).reduce((sum, amount) => sum.add(amount))
}

export const Money: Resolvers["Money"] = {
  formatted: (money) => {
    const absoluteWithCommas = money
      .toString()
      .replace(/^-/, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return `${money.amount < 0 ? "-" : ""}${money.getCurrencyInfo().symbol}${absoluteWithCommas}`
  },

  formattedShort: (money) => {
    const absoluteAmount = Math.round(Math.abs(money.toDecimal()))
    let amount = absoluteAmount
    let suffix = ""

    if (absoluteAmount > 1_000_000) {
      amount = Math.round(absoluteAmount / 1_000_000)
      suffix = "M"
    } else if (absoluteAmount > 10_000) {
      amount = Math.round(absoluteAmount / 1_000)
      suffix = "K"
    }

    return `${money.amount < 0 ? "-" : ""}${money.getCurrencyInfo().symbol}${amount}${suffix}`
  },

  integerAmount: (money) => Math.round(money.amount),
  decimalAmount: (money) => money.toDecimal()
}
