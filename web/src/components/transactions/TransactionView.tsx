import { TbEye, TbEyeOff } from "solid-icons/tb"
import { Component, For, Show, createSignal } from "solid-js"
import { GetTransactionQuery } from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { formatDate } from "../../utils/formatters"
import { namedIcons } from "../../utils/namedIcons"
import CategoryIndicator from "../CategoryIndicator"
import { Button } from "../base/Button"
import { FormControl, FormLabel } from "../base/FormControl"
import { AmountEditor } from "./AmountEditor"
import { DateEditor } from "./DateEditor"
import { MemoEditor } from "./MemoEditor"
import RelationEditor from "./RelationEditor"

export const TransactionView: Component<{
  data: GetTransactionQuery
}> = (props) => {
  const [editingMemo, setEditingMemo] = createSignal<string>()
  const [editingAmount, setEditingAmount] = createSignal(false)
  const [editingshopAmount, setEditingshopAmount] = createSignal(false)
  const [editingDate, setEditingDate] = createSignal(false)

  const updateTransaction = useUpdateTransaction()

  const transaction = () => props.data.transaction

  return (
    <Show when={transaction()}>
      {(transaction) => (
        <>
          <FormControl>
            <FormLabel>Memo</FormLabel>
            <Show
              when={editingMemo() === transaction().id}
              fallback={
                <div onClick={() => setEditingMemo(transaction().id)}>{transaction().memo}</div>
              }
            >
              <MemoEditor
                transaction={transaction()}
                stopEditing={() => setEditingMemo(undefined)}
              />
            </Show>
          </FormControl>

          <FormControl>
            <FormLabel>Amount</FormLabel>
            <Show
              when={editingAmount()}
              fallback={
                <div onClick={() => setEditingAmount(true)}>
                  {transaction().amount?.formatted ?? <em>Pending</em>}
                </div>
              }
            >
              <AmountEditor
                transaction={transaction()}
                stopEditing={() => setEditingAmount(false)}
              />
            </Show>
          </FormControl>

          <FormControl>
            <FormLabel>Original amount</FormLabel>
            <Show
              when={editingshopAmount()}
              fallback={
                <div onClick={() => setEditingshopAmount(true)}>
                  {transaction().shopAmount?.formatted ?? <em>None</em>}
                </div>
              }
            >
              <AmountEditor
                transaction={transaction()}
                field="shopAmount"
                stopEditing={() => setEditingshopAmount(false)}
              />
            </Show>
          </FormControl>

          <FormControl>
            <FormLabel>Account</FormLabel>
            <RelationEditor
              transaction={transaction()}
              includeInReports={transaction().includeInReports}
              showCategory={false}
            >
              {transaction().account.name} ({transaction().account.currency.code})
            </RelationEditor>
          </FormControl>

          <FormControl>
            <FormLabel>Date</FormLabel>
            <Show
              when={editingDate()}
              fallback={
                <div onClick={() => setEditingDate(true)}>
                  {formatDate(transaction().date, "fullDate")}
                </div>
              }
            >
              <DateEditor transaction={transaction()} stopEditing={() => setEditingDate(false)} />
            </Show>
          </FormControl>

          <Show
            when={!transaction().includeInReports || (transaction().amount?.amountDecimal || 0) > 0}
          >
            <FormControl>
              <FormLabel>Category</FormLabel>
              <div class="flex items-center">
                <CategoryIndicator
                  class="mr-3 h-8 w-8"
                  isIncome={(transaction().amount?.amountDecimal || 0) > 0}
                  includeInReports={transaction().includeInReports}
                />
                {transaction().includeInReports ? "Income" : "Hidden from reports"}
              </div>
            </FormControl>
          </Show>

          <Show
            when={
              !transaction().splitTo.length &&
              transaction().includeInReports &&
              transaction().amount &&
              transaction().amount!.amountDecimal <= 0
            }
          >
            <FormControl>
              <FormLabel>Category</FormLabel>
              <RelationEditor
                transaction={transaction()}
                includeInReports={transaction().includeInReports}
                showAccount={false}
              >
                <div class="flex items-center">
                  <CategoryIndicator
                    class="mr-3 h-8 w-8"
                    color={transaction().category?.color}
                    icon={
                      transaction().category?.icon
                        ? namedIcons[transaction().category!.icon]
                        : undefined
                    }
                  />
                  {transaction().category?.name || "Uncategorized"}
                </div>
              </RelationEditor>
            </FormControl>
          </Show>

          <Show when={transaction().splitTo?.length}>
            <h2 class="text-lg font-semibold">Items</h2>

            <For each={transaction().splitTo}>
              {(child) => (
                <div class="flex items-center gap-3 pt-4">
                  <RelationEditor
                    parent={transaction()}
                    transaction={child}
                    showAccount={false}
                    includeInReports={child.includeInReports}
                  />
                  <Show
                    when={editingMemo() === child.id}
                    fallback={
                      <div
                        class="mr-2 min-w-0 flex-1 truncate"
                        onClick={() => setEditingMemo(child.id)}
                      >
                        {child.memo}
                      </div>
                    }
                  >
                    <MemoEditor
                      class="mr-2 min-w-0 flex-1"
                      transaction={child}
                      stopEditing={() => setEditingMemo(undefined)}
                    />
                  </Show>
                  <div class="text-right">
                    {child.amount?.formatted ?? <em>Pending</em>}
                    <Show when={child.shopAmount}>
                      {(shopAmount) => (
                        <div class="text-xs text-gray-500">{shopAmount().formatted}</div>
                      )}
                    </Show>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      updateTransaction({
                        id: child.id,
                        input: { includeInReports: !child.includeInReports }
                      })
                    }
                  >
                    {child.includeInReports ? <TbEye /> : <TbEyeOff />}
                  </Button>
                </div>
              )}
            </For>
          </Show>
        </>
      )}
    </Show>
  )
}
