import { Resolvers } from "../resolvers-types"

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
