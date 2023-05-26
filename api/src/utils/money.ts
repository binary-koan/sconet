import { Currency, Money } from "ts-money"

export const moneyAbs = (money: Money) => new Money(Math.abs(money.amount), money.currency)

export const moneySum = (money: Money[], currency: Currency) =>
  money.reduce((total, amount) => total.add(amount), new Money(0, currency))
