import { ObjectSetter } from "@felte/common"
import { Component, createMemo, For, Show } from "solid-js"
import { TransactionsQuery } from "../../graphql-types"
import { monthRange } from "../../utils/date"
import { formatDate } from "../../utils/formatters"
import { Button } from "../base/Button"
import NewTransactionItem from "./NewTransactionItem"
import TransactionItem from "./TransactionItem"

export const TransactionsList: Component<{
  data: TransactionsQuery
  fetchMore?: (variables: any) => void
  setFilter: ObjectSetter<any>
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

    const items: Array<{ date: Date; transactions: any[] }> = []

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
                  class="z-docked sticky top-0 bg-gray-50 py-2 lg:top-14 lg:-mx-2"
                  classList={{ "-mt-2": index() === 0, "mt-6": index() !== 0 }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      props.setFilter((filters: any) => ({
                        ...filters,
                        dateFrom: dateFrom.toISOString(),
                        dateUntil: dateUntil.toISOString()
                      }))
                    }
                    class="mx-2 inline-block rounded bg-gray-500 px-2 py-1 text-sm font-bold text-white"
                  >
                    {formatDate(date, "monthYear")}
                  </button>
                </div>
              </Show>

              <div class="px-4 py-2 text-sm font-bold text-gray-600">
                {formatDate(date, "fullDateWithoutYear")}
              </div>

              <Show when={props.isEditing}>
                <NewTransactionItem date={newTransactionDate} />
              </Show>

              <For each={transactions}>
                {(transaction) => (
                  <TransactionItem transaction={transaction} isEditing={props.isEditing} />
                )}
              </For>

              <Show when={!props.isEditing && !transactions.length}>
                <div class="flex items-center px-4 pb-2 italic text-gray-600 shadow-sm">-</div>
              </Show>
            </>
          )
        }}
      </For>

      <Show when={props.fetchMore}>
        <Button onClick={props.fetchMore}>Fetch more</Button>
      </Show>
    </>
  )
}
