import { IconPlus } from "@tabler/icons-solidjs"
import { Component, createMemo, createSignal, For, Show } from "solid-js"
import { ListingTransactionFragment, TransactionsQuery } from "../../graphql-types.ts"
import { monthRange, stripTime } from "../../utils/date.ts"
import { formatDate } from "../../utils/formatters.ts"
import { Button } from "../base/Button.tsx"
import { NewTransactionModal } from "./NewTransactionModal.tsx"
import { TransactionFilterValues } from "./TransactionFilters.tsx"
import TransactionItem from "./TransactionItem.tsx"

export const TransactionsList: Component<{
  data: TransactionsQuery
  isFiltering: boolean
  fetchMore?: (variables: any) => void
  setFilterValue: (name: keyof TransactionFilterValues, value: any) => void
}> = (props) => {
  const [showingModalForDate, setShowingModalForDate] = createSignal<Date>()

  const items = createMemo(() => {
    const transactions = props.data.transactions.nodes

    if (!transactions.length) return []

    const firstTransactionDate = new Date(transactions.at(0)!.date)
    const lastTransactionDate = new Date(transactions.at(-1)!.date)

    const items: Array<{ date: Date; transactions: ListingTransactionFragment[] }> = []

    for (
      let date = new Date(firstTransactionDate);
      date >= lastTransactionDate;
      date.setDate(date.getDate() - 1)
    ) {
      const transactionsOnDate = transactions.filter(
        (transaction) => transaction.date === stripTime(date)
      )

      if (transactionsOnDate.length || !props.isFiltering) {
        items.push({ date: new Date(date), transactions: transactionsOnDate })
      }
    }

    return items
  })

  return (
    <>
      <Show when={showingModalForDate()}>
        <NewTransactionModal
          initialDate={showingModalForDate()}
          isOpen={true}
          onClose={() => setShowingModalForDate(undefined)}
        />
      </Show>
      <Show when={items().length === 0}>
        <div class="px-4 italic">No transactions found.</div>
      </Show>
      <For each={items()}>
        {({ date, transactions }, index) => {
          const newMonth = () =>
            index() === 0 ||
            formatDate(items()[index() - 1].date, "monthYear") !== formatDate(date, "monthYear")
          const [dateFrom, dateUntil] = monthRange(new Date(date))

          const newTransactionDate = new Date(date)
          newTransactionDate.setHours(12, 0, 0, 0)

          return (
            <>
              <Show when={newMonth()}>
                <div
                  class="z-docked sticky top-12 bg-gray-50 pt-2 lg:top-28"
                  classList={{
                    "-mt-2": index() === 0,
                    "mt-6": index() !== 0
                  }}
                >
                  <div class="relative">
                    <div class="absolute left-4 right-4 top-1/2 border-b border-gray-200" />
                    <button
                      type="button"
                      onClick={() => {
                        props.setFilterValue("dateFrom", stripTime(dateFrom))
                        props.setFilterValue("dateUntil", stripTime(dateUntil))
                      }}
                      class="relative mx-2 inline-block rounded bg-gray-50 py-1 pl-2 pr-4 text-base font-semibold text-gray-700"
                    >
                      {formatDate(date, "monthYear")}
                    </button>
                  </div>
                </div>
              </Show>

              <div
                class="flex px-2 pb-2 pt-5 text-sm text-gray-600"
                data-testid="transactions-date"
              >
                <Button
                  variant="ghost"
                  size="custom"
                  class="mr-1 h-5 gap-1 px-2 text-xs text-gray-500"
                  onClick={() => setShowingModalForDate(date)}
                >
                  <IconPlus />
                </Button>
                {formatDate(date, "fullDateWithoutYear")}
              </div>

              <div class="flex flex-col gap-px bg-gray-100 shadow-sm">
                <For each={transactions}>
                  {(transaction) => <TransactionItem transaction={transaction} />}
                </For>
              </div>
            </>
          )
        }}
      </For>

      <Show when={props.fetchMore && props.data.transactions.pageInfo.endCursor}>
        <Button variant="ghost" class="mt-2" onClick={props.fetchMore}>
          Fetch more
        </Button>
      </Show>
    </>
  )
}
