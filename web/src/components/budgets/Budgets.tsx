import { Component } from "solid-js"
import { BudgetQuery } from "../../graphql-types"
import { monthRange } from "../../utils/date"
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
    const searchParams = new URLSearchParams()
    searchParams.set(
      "filters",
      JSON.stringify({
        dateFrom: range()[0].toISOString(),
        dateUntil: range()[1].toISOString(),
        ...filters
      })
    )

    return `/transactions?${searchParams.toString()}`
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
