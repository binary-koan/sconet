import { Component, Show } from "solid-js"
import { BudgetQuery } from "../../graphql-types"
import { LinkButton } from "../base/Button"

export const BudgetSummary: Component<{
  budget: BudgetQuery["budget"]
  year: string
  month: string
  isPastMonth: boolean
  filteredTransactions: (filters?: any) => string
}> = (props) => {
  return (
    <div class="flex items-center px-4 lg:pb-6">
      <LinkButton
        href={props.filteredTransactions({ minAmount: 0 })}
        size="custom"
        class="mr-2 flex flex-1 flex-col items-center p-2"
      >
        <div class="text-sm lg:text-xl">{props.budget.income.formatted}</div>
        <div class="truncate text-xs">Income</div>
      </LinkButton>

      <Show when={props.isPastMonth}>
        <div class="text-2xl">-</div>
      </Show>

      <LinkButton
        href={props.filteredTransactions({ maxAmount: 0 })}
        size="custom"
        class="ml-2 flex flex-1 flex-col items-center p-2"
      >
        <div class="text-sm lg:text-xl">{props.budget.totalSpending.formatted}</div>
        <div class="truncate text-xs">Spending</div>
      </LinkButton>

      <Show when={props.isPastMonth}>
        <div class="ml-2 text-2xl">=</div>

        <LinkButton
          href={props.filteredTransactions()}
          size="custom"
          class="ml-2 flex flex-1 flex-col items-center p-2"
        >
          <div
            class="text-sm lg:text-xl"
            classList={{
              "text-red-600": props.budget.difference.decimalAmount < 0,
              "text-green-600": props.budget.difference.decimalAmount >= 0
            }}
          >
            {props.budget.difference.formatted}
          </div>
          <div class="truncate text-xs">Balance</div>
        </LinkButton>
      </Show>
    </div>
  )
}
