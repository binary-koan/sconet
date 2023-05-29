import { Component } from "solid-js"
import { BudgetQuery } from "../../graphql-types"
import { CategoryColor } from "../../utils/categoryColors"
import { monthRange, stripTime } from "../../utils/date"
import { namedIcons } from "../../utils/namedIcons"
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
        showDifference={isPastMonth()}
        filteredTransactions={filteredTransactions}
        budget={props.data.budget}
      />

      <BudgetGroup
        title="Regular spending"
        total={props.data.budget.regularCategories.totalSpending.formatted}
        allTransactionsHref={filteredTransactions({
          categoryIds: props.data.budget.regularCategories.categories.map(
            ({ category }) => category?.id || null
          )
        })}
        items={props.data.budget.regularCategories.categories.map(({ category, amountSpent }) => ({
          indicator: {
            color: category?.color as CategoryColor,
            icon: category?.icon ? namedIcons[category.icon] : undefined
          },
          name: category?.name || "Uncategorized",
          color: category?.color as CategoryColor,
          budget: category?.budget,
          total: amountSpent,
          href: filteredTransactions({ categoryIds: [category?.id || null] })
        }))}
      />

      <BudgetGroup
        title="Contingent spending"
        total={props.data.budget.irregularCategories.totalSpending.formatted}
        allTransactionsHref={filteredTransactions({
          categoryIds: props.data.budget.irregularCategories.categories.map(
            ({ category }) => category?.id || null
          )
        })}
        items={props.data.budget.irregularCategories.categories.map(
          ({ category, amountSpent }) => ({
            indicator: {
              color: category?.color as CategoryColor,
              icon: category?.icon ? namedIcons[category.icon] : undefined
            },
            name: category?.name || "Uncategorized",
            color: category?.color as CategoryColor,
            budget: category?.budget,
            total: amountSpent,
            href: filteredTransactions({ categoryIds: [category?.id || null] })
          })
        )}
      />

      <BudgetGroup
        title="Income"
        total={props.data.income.totalAmount.formatted}
        allTransactionsHref={filteredTransactions({ minAmount: 1 })}
        items={props.data.income.data.map((transaction) => ({
          indicator: { isIncome: true },
          name: transaction.memo,
          budget: false,
          total: transaction.amount,
          href: `/transactions/${transaction.id}`
        }))}
      />
    </>
  )
}
