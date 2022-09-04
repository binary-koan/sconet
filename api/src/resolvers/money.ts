import { CurrencyRecord } from "../db/records/currency"
import { Resolvers } from "../resolvers-types"

export interface MoneyOptions {
  amount: number
  currency: CurrencyRecord
}

export const Money: Resolvers["Money"] = {
  formatted: (options) => {
    const decimalAmount = Math.abs(options.amount / 10 ** options.currency.decimalDigits).toFixed(
      options.currency.decimalDigits
    )

    return `${options.amount < 0 ? "-" : ""}${options.currency.symbol}${decimalAmount}`
  },
  integerAmount: (options) => options.amount,
  decimalAmount: (options) => options.amount / 10 ** options.currency.decimalDigits
}
