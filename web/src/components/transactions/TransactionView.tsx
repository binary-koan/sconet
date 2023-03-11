import { Component, For, Show } from "solid-js"
import { GetTransactionQuery } from "../../graphql-types"
import { formatDate } from "../../utils/formatters"
import { namedIcons } from "../../utils/namedIcons"
import { FormControl, FormLabel } from "../base/FormControl"
import CategoryIndicator from "../CategoryIndicator"

export const TransactionView: Component<{
  data: GetTransactionQuery
}> = (props) => {
  const transaction = props.data.transaction

  return (
    <Show when={transaction}>
      <FormControl>
        <FormLabel>Memo</FormLabel>
        <div>{transaction!.memo}</div>
      </FormControl>

      <FormControl>
        <FormLabel>Amount</FormLabel>
        <div>{transaction!.amount?.formatted}</div>
      </FormControl>

      <FormControl>
        <FormLabel>Date</FormLabel>
        <div>{formatDate(transaction!.date, "fullDate")}</div>
      </FormControl>

      <FormControl>
        <FormLabel>Category</FormLabel>
        <div>{transaction!.category?.name || "Uncategorized"}</div>
      </FormControl>

      <Show when={transaction!.splitTo?.length}>
        <h2 class="text-lg font-semibold">Split to</h2>

        <For each={transaction!.splitTo}>
          {(child) => (
            <div class="flex items-center gap-3 pt-4">
              <CategoryIndicator
                class="h-8 w-8"
                iconSize="1.25em"
                icon={child.category?.icon ? namedIcons[child.category?.icon] : undefined}
                color={child.category?.color}
                includeInReports={child.includeInReports}
                isIncome={child.amount.decimalAmount > 0}
              />
              {child.memo}
              <div class="ml-auto">{child.amount.formatted}</div>
            </div>
          )}
        </For>
      </Show>
    </Show>
  )
}
