import { useNavigate } from "@solidjs/router"
import { sumBy } from "lodash"
import { TbArrowLeft, TbArrowRight, TbPlus } from "solid-icons/tb"
import { Component, For, Show } from "solid-js"
import { FullTransactionFragment, TransactionsQuery } from "../../graphql-types"
import { Button } from "../base/Button"

export const TransactionsCalendar: Component<{
  data: TransactionsQuery
  year: string
  month: string
}> = (props) => {
  const navigate = useNavigate()

  const monthStart = new Date(parseInt(props.year), parseInt(props.month) - 1, 1)

  const dates = () => buildMonthDates(props.year, props.month, props.data.transactions.data)

  return (
    <>
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
            {({ date, isCurrentMonth, expenses, incomes }) => (
              <div
                class="[&:nth-child(7n)]:border-r-0 flex h-16 flex-col border-t border-r border-gray-200 p-1 text-center text-sm lg:h-32 lg:text-left"
                classList={{
                  "text-gray-400": !isCurrentMonth,
                  "bg-violet-800 text-white": !!expenses.length
                }}
              >
                <div class="flex flex-col lg:flex-row lg:pl-1">
                  <span class="font-semibold lg:mr-auto">{date.getDate()}</span>
                  <Show when={expenses.length}>
                    <div class="my-auto text-xs">
                      {sumBy(expenses, (transaction) => transaction.amount.decimalAmount)}
                    </div>
                  </Show>
                  <Show when={isCurrentMonth}>
                    <Button
                      variant="ghost"
                      size="custom"
                      class="ml-2 hidden h-5 w-5 text-xs lg:flex"
                    >
                      <TbPlus />
                    </Button>
                  </Show>
                </div>

                <div class="mt-1 hidden flex-col gap-0.5 lg:flex">
                  <For each={expenses.concat(incomes).slice(0, 3)}>
                    {(transaction) => (
                      <div class="flex rounded bg-white px-1 py-0.5 text-xs text-gray-900">
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

const buildMonthDates = (year: string, month: string, transactions: FullTransactionFragment[]) => {
  const monthStart = new Date(parseInt(year), parseInt(month) - 1, 1)
  const monthEnd = new Date(parseInt(year), parseInt(month), 0)

  const lastDate = new Date(monthEnd)
  lastDate.setDate(lastDate.getDate() + daysAfterToShow(monthEnd.getDay()))

  let date = new Date(monthStart)
  date.setDate(date.getDate() - daysBeforeToShow(monthStart.getDay()))

  let dates: Array<{
    date: Date
    isCurrentMonth: boolean
    expenses: FullTransactionFragment[]
    incomes: FullTransactionFragment[]
  }> = []

  while (date.getTime() <= lastDate.getTime()) {
    dates.push({
      date: new Date(date),
      isCurrentMonth: date.getMonth() === parseInt(month) - 1,
      expenses: transactions.filter(
        (transaction) =>
          isSameDate(new Date(transaction.date), date) && transaction.amount.decimalAmount < 0
      ),
      incomes: transactions.filter(
        (transaction) =>
          isSameDate(new Date(transaction.date), date) && transaction.amount.decimalAmount > 0
      )
    })

    date.setDate(date.getDate() + 1)
  }

  return dates
}

const daysBeforeToShow = (dayOfWeek: number) => {
  if (dayOfWeek === 0) {
    return 6
  } else if (dayOfWeek === 1) {
    return 7
  } else {
    return dayOfWeek - 1
  }
}

const daysAfterToShow = (dayOfWeek: number) => {
  return 7 - dayOfWeek
}

const isSameDate = (first: Date, second: Date) => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}
