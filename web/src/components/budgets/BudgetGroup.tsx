import { TbListSearch } from "solid-icons/tb"
import { Component, For, Show } from "solid-js"
import { BudgetQuery } from "../../graphql-types"
import { CategoryColor, CATEGORY_BACKGROUND_COLORS } from "../../utils/categoryColors"
import { getCssValue } from "../../utils/getCssValue"
import { namedIcons } from "../../utils/namedIcons"
import { LinkButton } from "../base/Button"
import CategoryIndicator from "../CategoryIndicator"
import { PieChart } from "./PieChart"

const BudgetGroup: Component<{
  title: string
  group: BudgetQuery["budget"]["regularCategories"]
  filteredTransactionsRoute: (filters?: any) => string
}> = (props) => {
  return (
    <div class="flex flex-col lg:flex-row-reverse">
      <PieChart
        data={props.group.categories.map(({ category, amountSpent }) => ({
          name: category?.name || "Uncategorized",
          color: category?.color
            ? getCssValue(`--color-${category.color}-500`)
            : getCssValue("--color-gray-400"),
          value: amountSpent.decimalAmount,
          formattedValue: amountSpent.formatted
        }))}
      />
      <div class="flex-none lg:flex-1">
        <h2 class="mb-2 flex items-center px-4 font-semibold">
          {props.title}
          <span class="ml-auto">{props.group.totalSpending.formatted}</span>
          <LinkButton
            href={props.filteredTransactionsRoute({
              categoryIds: props.group.categories.map((category) => category?.id || null)
            })}
            size="square"
            variant="ghost"
            colorScheme="primary"
            class="ml-4"
            aria-label="View transactions"
          >
            <TbListSearch />
          </LinkButton>
        </h2>
        <div class="mb-6 bg-white pl-6 pr-4 pt-4 shadow-sm lg:ml-4">
          <Show when={!props.group.categories.length}>
            <div class="pb-4">Nothing spent</div>
          </Show>

          <For each={props.group.categories}>
            {({ category, amountSpent }) => (
              <div class="flex items-center pb-4">
                <CategoryIndicator
                  class="mr-3 h-8 w-8"
                  color={category?.color}
                  icon={category?.icon ? namedIcons[category.icon] : undefined}
                />
                <div class="min-w-0 flex-1">
                  <div class="mt-1 flex">
                    <div class="truncate">{category?.name || "Uncategorized"}</div>
                    <div class="ml-auto pl-2">{amountSpent.formatted}</div>
                  </div>

                  <div class="h-1 w-full rounded-full bg-gray-200">
                    <div
                      class="h-1 rounded-full"
                      classList={{
                        [category?.color
                          ? CATEGORY_BACKGROUND_COLORS[category.color as CategoryColor]
                          : "bg-gray-600"]: true
                      }}
                      style={{
                        width: category?.budget
                          ? `${
                              Math.min(
                                amountSpent.decimalAmount / category.budget.decimalAmount,
                                1
                              ) * 100
                            }%`
                          : 0
                      }}
                    ></div>
                  </div>

                  <div class="flex">
                    {category?.budget ? (
                      <>
                        <span
                          class="text-xs"
                          classList={{
                            "text-danger-600 font-bold":
                              amountSpent.decimalAmount > category.budget.decimalAmount,
                            "text-gray-600":
                              amountSpent.decimalAmount <= category.budget.decimalAmount
                          }}
                        >
                          {(
                            (amountSpent.decimalAmount / category.budget.decimalAmount) *
                            100
                          ).toFixed(0)}
                          % spent
                        </span>
                        <span class="ml-auto text-xs text-gray-600">
                          {category.budget.formatted} budget
                        </span>
                      </>
                    ) : (
                      <span class="ml-auto text-xs text-gray-600">No budget</span>
                    )}
                  </div>
                </div>
                <LinkButton
                  href={props.filteredTransactionsRoute({
                    categoryIds: [category?.id || null]
                  })}
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
    </div>
  )
}

export default BudgetGroup
