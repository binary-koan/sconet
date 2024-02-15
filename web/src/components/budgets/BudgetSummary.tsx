import { Component, Show } from "solid-js"
import { BudgetQuery } from "../../graphql-types"
import { LinkButton } from "../base/Button"

export const BudgetSummary: Component<{
  budget: Pick<BudgetQuery["budget"], "income" | "totalSpending" | "difference">
  showDifference: boolean
  filteredTransactions: (filters?: any) => string
}> = (props) => {
  return (
    <div class="flex items-center gap-1 px-4 md:gap-2 md:pb-6">
      <LinkButton
        href={props.filteredTransactions({ minAmount: 0 })}
        size="custom"
        class="flex flex-1 flex-col items-center px-1 py-2"
      >
        <div class="text-sm md:text-xl" data-testid="total-income">
          {props.budget.income.formatted}
        </div>
        <div class="truncate text-xs">Income</div>
      </LinkButton>

      <Show when={props.showDifference}>
        <div class="md:text-2xl">-</div>
      </Show>

      <LinkButton
        href={props.filteredTransactions({ maxAmount: 0 })}
        size="custom"
        class="flex flex-1 flex-col items-center px-1 py-2"
      >
        <div class="text-sm md:text-xl" data-testid="total-spending">
          {props.budget.totalSpending.formatted}
        </div>
        <div class="truncate text-xs">Spending</div>
      </LinkButton>

      <Show when={props.showDifference}>
        <div class="md:text-2xl">=</div>

        <LinkButton
          href={props.filteredTransactions()}
          size="custom"
          class="flex flex-1 flex-col items-center px-1 py-2"
        >
          <div
            class="text-sm md:text-xl"
            classList={{
              "text-red-600": props.budget.difference.amountDecimal < 0,
              "text-green-600": props.budget.difference.amountDecimal >= 0
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
