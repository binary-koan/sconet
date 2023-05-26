import { Component } from "solid-js"
import { BudgetQuery } from "../../graphql-types"
import { monthRange, stripTime } from "../../utils/date"
import BudgetGroup from "./BudgetGroup"
import { BudgetSummary } from "./BudgetSummary"

export const Budgets: Component<{
  data: BudgetQuery
  year: string
  month: string
}> = (props) => {
  const range = () => monthRange(new Date(parseInt(props.year), parseInt(props.month) - 1))

  const isPastMonth = () => new Date() > range()[1]

  const filteredTransactions = (filters: any = {}) => {
    const filter = JSON.stringify({
      dateFrom: stripTime(range()[0]),
      dateUntil: stripTime(range()[1]),
      ...filters
    })

    return `/transactions/list/${encodeURIComponent(filter)}`
  }

  return (
    <>
      <BudgetSummary
        isPastMonth={isPastMonth()}
        filteredTransactions={filteredTransactions}
        budget={props.data.budget}
        year={props.year}
        month={props.month}
      />
      <BudgetGroup
        title="Regular spending"
        group={props.data.budget.regularCategories}
        filteredTransactionsRoute={filteredTransactions}
      />
      <BudgetGroup
        title="Contingent spending"
        group={props.data.budget.irregularCategories}
        filteredTransactionsRoute={filteredTransactions}
      />
    </>
  )
}
