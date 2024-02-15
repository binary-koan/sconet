import { TbListSearch } from "solid-icons/tb"
import { Component, For, Show } from "solid-js"
import { CATEGORY_BACKGROUND_COLORS, CategoryColor } from "../../utils/categoryColors"
import { getCssValue } from "../../utils/getCssValue"
import CategoryIndicator, { CategoryIndicatorProps } from "../CategoryIndicator"
import { LinkButton } from "../base/Button"
import { PieChart } from "./PieChart"

interface BudgetGroupProps {
  title: string
  total: string
  allTransactionsHref: string
  items: Array<{
    indicator: CategoryIndicatorProps
    name: string
    color?: CategoryColor
    budget?: { amountDecimal: number; formatted: string } | null | false
    total: { amountDecimal: number; formatted: string }
    href: string
  }>
}

const BudgetGroup: Component<BudgetGroupProps> = (props) => {
  return (
    <div class="mt-6 flex flex-col lg:mt-0 lg:flex-row">
      <div class="min-w-0 flex-none lg:flex-1">
        <h2 class="mb-2 flex items-center px-4 font-semibold">
          {props.title}
          <span class="ml-auto">{props.total}</span>
          <LinkButton
            href={props.allTransactionsHref}
            size="square"
            variant="ghost"
            colorScheme="primary"
            class="ml-4"
            aria-label="View transactions"
          >
            <TbListSearch />
          </LinkButton>
        </h2>
        <div class="bg-white pl-6 pr-4 pt-4 shadow-sm lg:mb-6 lg:ml-4">
          <Show when={!props.items.length}>
            <div class="pb-4">No transactions</div>
          </Show>

          <For each={props.items}>
            {({ indicator, name, color, total, budget, href }) => (
              <div class="flex items-center pb-4">
                <CategoryIndicator class="mr-3 h-8 w-8" {...indicator} />
                <div class="min-w-0 flex-1">
                  <div class="flex" classList={{ "mt-1": budget !== false }}>
                    <div class="min-w-0 truncate">{name || "Uncategorized"}</div>
                    <div class="ml-auto pl-2">{total.formatted}</div>
                  </div>

                  <Show when={budget !== false}>
                    <div class="h-1 w-full rounded-full bg-gray-200">
                      <div
                        class="h-1 rounded-full"
                        classList={{
                          [color
                            ? CATEGORY_BACKGROUND_COLORS[color as CategoryColor]
                            : "bg-gray-600"]: true
                        }}
                        style={{
                          width: budget
                            ? `${Math.min(total.amountDecimal / budget.amountDecimal, 1) * 100}%`
                            : 0
                        }}
                      />
                    </div>

                    <div class="flex">
                      {budget ? (
                        <>
                          <span
                            class="text-xs"
                            classList={{
                              "text-danger-600 font-bold":
                                total.amountDecimal > budget.amountDecimal,
                              "text-gray-600": total.amountDecimal <= budget.amountDecimal
                            }}
                          >
                            {((total.amountDecimal / budget.amountDecimal) * 100).toFixed(0)}% spent
                          </span>
                          <span class="ml-auto text-xs text-gray-600">
                            {budget.formatted} budget
                          </span>
                        </>
                      ) : (
                        <span class="ml-auto text-xs text-gray-600">No budget</span>
                      )}
                    </div>
                  </Show>
                </div>
                <LinkButton
                  href={href}
                  size="square"
                  variant="ghost"
                  colorScheme="primary"
                  class="ml-4"
                  aria-label="View transactions"
                >
                  <TbListSearch />
                </LinkButton>
              </div>
            )}
          </For>
        </div>
      </div>
      <PieChart
        data={props.items.map(({ name, color, total }) => ({
          name: name || "Uncategorized",
          color: color ? getCssValue(`--color-${color}-500`) : getCssValue("--color-gray-400"),
          value: total.amountDecimal,
          formattedValue: total.formatted
        }))}
      />
    </div>
  )
}

export default BudgetGroup
