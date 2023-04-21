import { useNavigate } from "@solidjs/router"
import { Component, For, Show, createSignal } from "solid-js"
import { GetTransactionQuery } from "../../graphql-types"
import { formatDate } from "../../utils/formatters"
import { FormControl, FormLabel } from "../base/FormControl"
import MemoEditor from "./MemoEditor"
import RelationEditor from "./RelationEditor"

export const TransactionView: Component<{
  data: GetTransactionQuery
}> = (props) => {
  const navigate = useNavigate()
  const [editingMemo, setEditingMemo] = createSignal(false)

  const transaction = () => props.data.transaction

  return (
    <Show when={transaction}>
      <FormControl>
        <FormLabel>Memo</FormLabel>
        <Show
          when={editingMemo()}
          fallback={<div onClick={() => setEditingMemo(true)}>{transaction()!.memo}</div>}
        >
          <MemoEditor transaction={transaction()!} stopEditing={() => setEditingMemo(false)} />
        </Show>
      </FormControl>

      <FormControl>
        <FormLabel>Amount</FormLabel>
        <div>{transaction()!.amount?.formatted}</div>
      </FormControl>

      <FormControl>
        <FormLabel>Date</FormLabel>
        <div>{formatDate(transaction()!.date, "fullDate")}</div>
      </FormControl>

      <Show when={!transaction()!.splitTo.length}>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <div>{transaction()!.category?.name || "Uncategorized"}</div>
        </FormControl>
      </Show>

      <Show when={transaction()!.splitTo?.length}>
        <h2 class="text-lg font-semibold">Items</h2>

        <For each={transaction()!.splitTo}>
          {(child) => (
            <div
              class="flex items-center gap-3 pt-4"
              onClick={() => navigate(`/transactions/${child.id}/edit`)}
            >
              <RelationEditor
                parent={transaction}
                transaction={child}
                includeInReports={transaction()!.includeInReports}
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
