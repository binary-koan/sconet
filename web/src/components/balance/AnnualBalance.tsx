import { Component } from "solid-js"
import { BalanceQuery } from "../../graphql-types"
import { BudgetSummary } from "../budgets/BudgetSummary"
import { BalanceGraph } from "./BalanceGraph"

export const AnnualBalance: Component<{
  data: BalanceQuery
  year: string
}> = (props) => {
  const filteredTransactions = (filters: any = {}) => {
    const filter = JSON.stringify({
      dateFrom: `${props.year}-01-01`,
      dateUntil: `${props.year}-12-31`,
      ...filters
    })

    return `/transactions/list/${encodeURIComponent(filter)}`
  }

  return (
    <>
      <BudgetSummary
        showDifference
        filteredTransactions={filteredTransactions}
        budget={props.data.balance}
      />
      <BalanceGraph
        year={props.year}
        currencySymbol={props.data.balance.currency.symbol}
        incomes={props.data.balance.months.map((month) => month.income.decimalAmount)}
        spendings={props.data.balance.months.map((month) => -month.totalSpending.decimalAmount)}
        balances={props.data.balance.months.map((month) => month.difference.decimalAmount)}
      />
    </>
  )
}
