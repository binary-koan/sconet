import { useNavigate } from "@solidjs/router"
import { TbArrowLeft, TbArrowRight, TbPlus } from "solid-icons/tb"
import { Component, createSignal, For, Show } from "solid-js"
import { TransactionsByDayQuery } from "../../graphql-types"
import { buildMonthDates } from "../../utils/buildMonthDates"
import { CategoryColor, CATEGORY_PALE_BACKGROUND_COLORS } from "../../utils/categoryColors"
import { isSameDate } from "../../utils/date"
import { Button } from "../base/Button"
import { NewTransactionModal } from "./NewTransactionModal"

export const TransactionsCalendar: Component<{
  data: TransactionsByDayQuery
  year: string
  month: string
}> = (props) => {
  const [modalOpen, setModalOpen] = createSignal(false)

  const navigate = useNavigate()

  const monthStart = new Date(parseInt(props.year), parseInt(props.month) - 1, 1)

  const dates = () => monthDates(parseInt(props.year), parseInt(props.month), props.data)

  return (
    <>
      <NewTransactionModal isOpen={modalOpen()} onClose={() => setModalOpen(false)} />
      <div class="mx-auto mb-4 flex items-center rounded bg-gray-200">
        <Button size="square" aria-label="List" onClick={() => navigate("/transactions/list")}>
          <TbArrowLeft size="1.25em" />
        </Button>

        <span class="mx-4 font-semibold">
          {monthStart.toLocaleDateString("default", { month: "long", year: "numeric" })}
        </span>

        <Button size="square" aria-label="List" onClick={() => navigate("/transactions/list")}>
          <TbArrowRight size="1.25em" />
        </Button>
      </div>
      <div class="rounded bg-white shadow-sm">
        <div class="grid grid-cols-7">
          <For each={dates().slice(0, 7)}>
            {({ date }) => (
              <div class="[&:nth-child(7n)]:border-r-0 border-r border-gray-200 p-1 text-center text-xs font-semibold lg:px-2 lg:text-left">
                {date.toLocaleDateString("default", { weekday: "short" })}
              </div>
            )}
          </For>
          <For each={dates()}>
            {({ date, isCurrentMonth, totalSpent, expenses, incomes }) => (
              <div
                class="[&:nth-child(7n)]:border-r-0 flex h-16 flex-col border-t border-r border-gray-200 p-1 text-center text-sm lg:h-32 lg:text-left"
                classList={{
                  "text-gray-300": !isCurrentMonth
                }}
              >
                <div class="flex flex-col lg:flex-row lg:pl-1">
                  <span class="font-semibold lg:mr-auto">{date.getDate()}</span>
                  <Show when={expenses.length}>
                    <div class="my-auto text-xs font-bold">{totalSpent}</div>
                  </Show>
                  <Show when={isCurrentMonth}>
                    <Button
                      variant="ghost"
                      size="custom"
                      class="ml-2 hidden h-5 w-5 text-xs lg:flex"
                      onClick={() => setModalOpen(true)}
                    >
                      <TbPlus />
                    </Button>
                  </Show>
                </div>

                <div class="mt-1 hidden flex-col gap-0.5 lg:flex">
                  <For each={expenses.concat(incomes).slice(0, 3)}>
                    {(transaction) => (
                      <div
                        class="flex rounded px-1 py-0.5 text-xs text-gray-900"
                        classList={{
                          [transaction.category
                            ? CATEGORY_PALE_BACKGROUND_COLORS[
                                transaction.category.color as CategoryColor
                              ]
                            : "bg-gray-100"]: true
                        }}
                      >
                        {transaction.memo}
                        <span class="ml-auto">{transaction.amount.formatted}</span>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </>
  )
}

const monthDates = (year: number, month: number, result: TransactionsByDayQuery) => {
  return buildMonthDates(year, month).map(({ date, isCurrentMonth }) => {
    const day = result.transactionsByDay.find(({ date: transactionsDate }) =>
      isSameDate(date, new Date(transactionsDate))
    )

    return {
      date,
      isCurrentMonth,

      totalSpent: day?.totalSpent.formatted,

      expenses:
        day?.transactions.filter((transaction) => transaction.amount.decimalAmount < 0) || [],

      incomes: day?.transactions.filter((transaction) => transaction.amount.decimalAmount > 0) || []
    }
  })
}
