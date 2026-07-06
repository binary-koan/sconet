import { IconEye, IconEyeOff, IconRotateClockwise } from "@tabler/icons-solidjs"
import { Component, For, Show, createSignal } from "solid-js"
import { GetTransactionQuery } from "../../graphql-types"
import { useReplaceReceiptImage } from "../../graphql/mutations/replaceReceiptImageMutation"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { formatDate } from "../../utils/formatters"
import { rotateImage } from "../../utils/rotateImage"
import { namedIcons } from "../../utils/namedIcons"
import CategoryIndicator from "../CategoryIndicator"
import { Button } from "../base/Button"
import { FormControl, FormLabel } from "../base/FormControl"
import { AmountEditor } from "./AmountEditor"
import { DateEditor } from "./DateEditor"
import { MemoEditor } from "./MemoEditor"
import { ShopEditor } from "./ShopEditor"
import RelationEditor from "./RelationEditor"

export const TransactionView: Component<{
  data: GetTransactionQuery;
  showReceiptImages?: boolean;
}> = (props) => {
  const [editingShop, setEditingShop] = createSignal<string>()
  const [editingMemo, setEditingMemo] = createSignal<string>()
  const [editingAmount, setEditingAmount] = createSignal(false)
  const [editingshopAmount, setEditingshopAmount] = createSignal(false)
  const [editingDate, setEditingDate] = createSignal(false)

  const updateTransaction = useUpdateTransaction()
  const replaceReceiptImage = useReplaceReceiptImage()

  const rotateReceiptImage = async (image: { id: string; url: string; filename: string }) =>
    replaceReceiptImage({ id: image.id, image: await rotateImage(image.url, image.filename) })

  const transaction = () => props.data.transaction

  return (
    <Show when={transaction()}>
      {(transaction) => (
        <>
          <FormControl>
            <FormLabel>Shop</FormLabel>
            <Show
              when={editingShop() === transaction().id}
              fallback={
                <div onClick={() => setEditingShop(transaction().id)}>
                  {transaction().shop || <em class="italic">None</em>}
                </div>
              }
            >
              <ShopEditor
                transaction={transaction()}
                stopEditing={() => setEditingShop(undefined)}
              />
            </Show>
          </FormControl>

          <FormControl>
            <FormLabel>Memo</FormLabel>
            <Show
              when={editingMemo() === transaction().id}
              fallback={
                <div onClick={() => setEditingMemo(transaction().id)}>
                  {transaction().memo || <em class="italic">None</em>}
                </div>
              }
            >
              <MemoEditor
                transaction={transaction()}
                stopEditing={() => setEditingMemo(undefined)}
              />
            </Show>
          </FormControl>

          <Show when={props.showReceiptImages !== false && transaction().receiptImages.length > 0}>
            <FormControl>
              <FormLabel>Receipt Images</FormLabel>
              <div class="flex flex-wrap gap-2">
                <For each={transaction().receiptImages}>
                  {(image) => (
                    <div class="relative">
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="group relative block h-24 w-24 overflow-hidden rounded border border-border hover:border-gray-400 dark:hover:border-gray-500"
                      >
                        <img
                          src={image.url}
                          alt={image.filename}
                          class="h-full w-full object-cover transition group-hover:opacity-90"
                        />
                      </a>
                      <Button
                        class="absolute right-1 top-1"
                        size="sm"
                        variant="ghost"
                        disabled={replaceReceiptImage.loading}
                        aria-label="Rotate image"
                        onClick={() => void rotateReceiptImage(image)}
                      >
                        <IconRotateClockwise size="1em" />
                      </Button>
                    </div>
                  )}
                </For>
              </div>
            </FormControl>
          </Show>

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
                  class="mr-3 h-6 w-6"
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
              (
                (transaction().amount && transaction().amount!.amountDecimal <= 0) ||
                (transaction().shopAmount && transaction().shopAmount!.amountDecimal <= 0)
              )
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
                    class="mr-3 h-6 w-6"
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
                        <div class="text-xs text-muted-foreground">{shopAmount().formatted}</div>
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
                    {child.includeInReports ? <IconEye /> : <IconEyeOff />}
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
