import { useNavigate } from "@solidjs/router"
import { Component, For, Show } from "solid-js"
import { GetTransactionQuery } from "../../graphql-types"
import { formatDate } from "../../utils/formatters"
import { FormControl, FormLabel } from "../base/FormControl"
import RelationEditor from "./RelationEditor"

export const TransactionView: Component<{
  data: GetTransactionQuery
}> = (props) => {
  const navigate = useNavigate()

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
        <h2 class="text-lg font-semibold">Items</h2>

        <For each={transaction!.splitTo}>
          {(child) => (
            <div
              class="flex items-center gap-3 pt-4"
              onClick={() => navigate(`/transactions/${child.id}/edit`)}
            >
              <RelationEditor
                parent={transaction}
                transaction={child}
                includeInReports={transaction!.includeInReports}
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
