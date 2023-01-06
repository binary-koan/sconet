import { TbPlus } from "solid-icons/tb"
import { Component, createMemo, For, Show } from "solid-js"
import { FullTransactionFragment, TransactionsQuery } from "../../graphql-types"
import { monthRange } from "../../utils/date"
import { formatDate } from "../../utils/formatters"
import { Button } from "../base/Button"
import { TransactionFilterValues } from "./TransactionFilters"
import TransactionItem from "./TransactionItem"

export const TransactionsList: Component<{
  data: TransactionsQuery
  fetchMore?: (variables: any) => void
  setFilterValue: (name: keyof TransactionFilterValues, value: any) => void
  isEditing: boolean
}> = (props) => {
  const items = createMemo(() => {
    const transactions = props.data.transactions.data

    if (!transactions.length) return []

    const firstTransactionDate = new Date(
      `${transactions.at(0)!.date.split("T")[0]}T00:00:00+09:00`
    )
    const lastTransactionDate = new Date(
      `${transactions.at(-1)!.date.split("T")[0]}T00:00:00+09:00`
    )

    const items: Array<{ date: Date; transactions: FullTransactionFragment[] }> = []

    for (
      let date = new Date(firstTransactionDate);
      date >= lastTransactionDate;
      date.setDate(date.getDate() - 1)
    ) {
      const transactionsOnDate = transactions.filter(
        (transaction) => formatDate(transaction.date, "fullDate") === formatDate(date, "fullDate")
      )

      items.push({ date: new Date(date), transactions: transactionsOnDate })
    }

    return items
  })

  return (
    <>
      <For each={items()}>
        {({ date, transactions }, index) => {
          const newMonth =
            index() === 0 ||
            formatDate(items()[index() - 1].date, "monthYear") !== formatDate(date, "monthYear")
          const [dateFrom, dateUntil] = monthRange(new Date(date))

          const newTransactionDate = new Date(date)
          newTransactionDate.setHours(12, 0, 0, 0)

          return (
            <>
              <Show when={newMonth}>
                <div
                  class="z-docked sticky top-0 bg-gray-50 pt-2 lg:top-14"
                  classList={{ "-mt-2": index() === 0, "mt-6": index() !== 0 }}
                >
                  <div class="absolute top-1/2 left-4 right-4 border-b border-gray-200" />
                  <button
                    type="button"
                    onClick={() => {
                      props.setFilterValue("dateFrom", dateFrom.toISOString())
                      props.setFilterValue("dateUntil", dateUntil.toISOString())
                    }}
                    class="relative mx-2 inline-block rounded bg-gray-50 py-1 pl-2 pr-4 text-base font-semibold text-gray-700"
                  >
                    {formatDate(date, "monthYear")}
                  </button>
                </div>
              </Show>

              <div class="flex justify-between px-4 pt-4 pb-2 text-sm text-gray-600">
                {formatDate(date, "fullDateWithoutYear")}

                <Show when={props.isEditing}>
                  <Button
                    variant="ghost"
                    size="custom"
                    class="ml-2 h-5 gap-1 px-2 text-xs text-gray-800"
                    onClick={() => {}}
                  >
                    <TbPlus /> Add
                  </Button>
                </Show>
              </div>

              <For each={transactions}>
                {(transaction) => (
                  <TransactionItem transaction={transaction} isEditing={props.isEditing} />
                )}
              </For>

              <Show when={!transactions.length}>
                <div class="flex items-center px-4 pb-2 italic text-gray-600">-</div>
              </Show>
            </>
          )
        }}
      </For>

      <Show when={props.fetchMore && props.data.transactions.nextOffset}>
        <Button variant="ghost" class="mt-2" onClick={props.fetchMore}>
          Fetch more
        </Button>
      </Show>
    </>
  )
}
