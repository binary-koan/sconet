import { Box, Button, Text } from "@hope-ui/solid"
import { Link } from "@solidjs/router"
import { Component, Show } from "solid-js"
import { BudgetsQuery } from "../../graphql-types"
import { monthRange } from "../../utils/date"
import BudgetGroup from "./BudgetGroup"
import { BudgetSummary } from "./BudgetSummary"

export const Budgets: Component<{
  budget: BudgetsQuery["budget"]
  year: number
  month: number
}> = (props) => {
  const range = () => monthRange(new Date(props.year, props.month - 1))

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
        {...props}
      />
      <BudgetGroup
        title="Regular spending"
        group={props.budget.regularCategories}
        filteredTransactionsRoute={filteredTransactions}
      />
      <BudgetGroup
        title="Contingent spending"
        group={props.budget.irregularCategories}
        filteredTransactionsRoute={filteredTransactions}
      />
    </>
  )
}
