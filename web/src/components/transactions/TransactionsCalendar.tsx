import { Link, useNavigate } from "@solidjs/router"
import { IconArrowLeft, IconArrowRight, IconDots, IconPlus } from "@tabler/icons-solidjs"
import { Component, For, Show, createSignal } from "solid-js"
import { TransactionsByDayQuery } from "../../graphql-types"
import { buildMonthDates } from "../../utils/buildMonthDates"
import {
  CATEGORY_BACKGROUND_COLORS,
  CATEGORY_PALE_BACKGROUND_COLORS,
  CategoryColor
} from "../../utils/categoryColors"
import {
  decrementMonth,
  incrementMonth,
  isAfterDate,
  isSameDate,
  stripTime
} from "../../utils/date"
import { MonthPickerOverlay } from "../MonthPickerOverlay"
import { Button } from "../base/Button"
import { NewTransactionModal } from "./NewTransactionModal"

export const TransactionsCalendar: Component<{
  data: TransactionsByDayQuery
  year: string
  month: string
}> = (props) => {
  const [newTransactionDate, setNewTransactionDate] = createSignal<Date>()

  const navigate = useNavigate()

  const monthStart = () => new Date(parseInt(props.year), parseInt(props.month) - 1, 1)

  const isCurrentMonth = () => {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    return monthStart().getTime() === thisMonthStart.getTime()
  }

  const dates = () => monthDates(parseInt(props.year), parseInt(props.month), props.data)

  const changeMonthAndNavigate = (
    changeMonth: (options: { monthNumber: number; year: number }) => {
      monthNumber: number
      year: number
    }
  ) => {
    const { monthNumber, year } = changeMonth({
      monthNumber: parseInt(props.month),
      year: parseInt(props.year)
    })
    navigate(`/transactions/calendar/${year}-${monthNumber.toString().padStart(2, "0")}`)
  }

  return (
    <>
      <Show when={!!newTransactionDate()}>
        <NewTransactionModal
          isOpen={true}
          initialDate={newTransactionDate()}
          onClose={() => setNewTransactionDate(undefined)}
        />
      </Show>

      <div class="mx-auto mb-4 flex rounded bg-gray-200">
        <Button
          size="square"
          aria-label="List"
          onClick={() => changeMonthAndNavigate(decrementMonth)}
        >
          <IconArrowLeft size="1.25em" />
        </Button>

        <MonthPickerOverlay
          class="flex items-center rounded px-4 font-semibold transition hover:bg-gray-300"
          value={`${props.year}-${props.month}`}
          onChange={(value) =>
            changeMonthAndNavigate(() => ({
              year: parseInt(value.split("-")[0]),
              monthNumber: parseInt(value.split("-")[1])
            }))
          }
          disableFutureDates
        >
          {monthStart().toLocaleDateString("default", { month: "long", year: "numeric" })}
        </MonthPickerOverlay>

        <Button
          size="square"
          aria-label="List"
          onClick={() => changeMonthAndNavigate(incrementMonth)}
          disabled={isCurrentMonth()}
        >
          <IconArrowRight size="1.25em" />
        </Button>
      </div>
      <div class="rounded bg-white shadow-sm">
        <div class="grid grid-cols-7">
          <For each={dates().slice(0, 7)}>
            {({ date }) => (
              <div class="[&:nth-child(7n)]:border-r-0 border-r border-gray-200 p-1 text-center text-xs font-semibold md:px-2 md:text-left">
                {date.toLocaleDateString("default", { weekday: "short" })}
              </div>
            )}
          </For>
          <For each={dates()}>
            {({ date, isCurrentMonth, totalSpent, expenses, incomes }) => (
              <div
                class="[&:nth-child(7n)]:border-r-0 flex h-16 flex-col border-r border-t border-gray-200 p-1 text-center text-sm md:h-32 md:text-left"
                classList={{ "text-gray-300": !isCurrentMonth }}
                data-testid={isSameDate(date, new Date()) ? "calendar-today" : "calendar-day"}
              >
                <div class="flex flex-col md:flex-row md:pl-1">
                  <span class="md:mr-auto md:font-semibold">{date.getDate()}</span>
                  <Show when={expenses.length}>
                    <Link
                      href={`/transactions/list/${encodeURIComponent(
                        JSON.stringify({
                          dateFrom: stripTime(date),
                          dateUntil: stripTime(date)
                        })
                      )}`}
                      class="text-2xs my-auto font-bold"
                    >
                      {totalSpent}
                    </Link>
                  </Show>
                  <Show when={isCurrentMonth && !isAfterDate(new Date(date), new Date())}>
                    <Button
                      variant="ghost"
                      size="custom"
                      class="ml-2 hidden h-5 w-5 text-xs md:flex"
                      onClick={() => setNewTransactionDate(date)}
                    >
                      <IconPlus />
                    </Button>
                  </Show>
                </div>

                <div class="mt-1 flex justify-center gap-1 md:hidden">
                  <For each={expenses.concat(incomes).slice(0, 3)}>
                    {(transaction) => (
                      <div
                        class="h-2 w-2 rounded-full"
                        classList={{
                          [transaction.category
                            ? CATEGORY_BACKGROUND_COLORS[
                                transaction.category.color as CategoryColor
                              ]
                            : "bg-gray-500"]: true
                        }}
                      />
                    )}
                  </For>

                  <Show when={expenses.concat(incomes).length > 3}>
                    <IconDots size="0.5rem" />
                  </Show>
                </div>

                <div class="mt-1 hidden flex-col gap-0.5 md:flex">
                  <For each={expenses.concat(incomes).slice(0, 3)}>
                    {(transaction) => (
                      <Link
                        href={`/transactions/${transaction.id}`}
                        class="flex rounded px-1 py-0.5 text-xs text-gray-900 transition hover:shadow"
                        classList={{
                          [transaction.category
                            ? CATEGORY_PALE_BACKGROUND_COLORS[
                                transaction.category.color as CategoryColor
                              ]
                            : "bg-gray-200"]: true
                        }}
                        data-testid="transaction-item"
                      >
                        <span class="truncate">{transaction.memo}</span>
                        <span
                          class="ml-auto whitespace-nowrap"
                          classList={{
                            "text-green-600": Boolean(
                              transaction.amount && transaction.amount.amountDecimal > 0
                            )
                          }}
                        >
                          {transaction.amount?.formatted ?? "?"}
                        </span>
                      </Link>
                    )}
                  </For>

                  <Show when={expenses.concat(incomes).length > 3}>
                    <Link
                      href={`/transactions/list/${encodeURIComponent(
                        JSON.stringify({
                          dateFrom: stripTime(date),
                          dateUntil: stripTime(date)
                        })
                      )}`}
                      class="rounded py-0.5 text-center text-xs text-gray-700 hover:text-gray-900"
                    >
                      {expenses.concat(incomes).length - 3} more
                    </Link>
                  </Show>
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

      totalSpent: day?.totalSpent.formattedShort,

      expenses:
        day?.transactions.filter(
          (transaction) => transaction.amount && transaction.amount.amountDecimal < 0
        ) || [],

      incomes:
        day?.transactions.filter(
          (transaction) => transaction.amount && transaction.amount.amountDecimal > 0
        ) || []
    }
  })
}
