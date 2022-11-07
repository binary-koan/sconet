import { Link } from "@solidjs/router"
import { TbEdit } from "solid-icons/tb"
import { Component, createEffect, createSignal, For, Show } from "solid-js"
import { Dynamic } from "solid-js/web"
import MemoEditor from "./MemoEditor"
import RelationEditor from "./RelationEditor"

const TransactionItem: Component<{ transaction: any; parent?: any; isEditing: boolean }> = (
  props
) => {
  const [editingMemo, setEditingMemo] = createSignal(false)

  const stopEditing = () => setEditingMemo(false)

  createEffect(() => {
    if (!props.isEditing) setEditingMemo(false)
  })

  const includeInReports = () =>
    Boolean(
      props.transaction.includeInReports ||
        props.transaction.splitTo?.some((child: any) => child.includeInReports)
    )

  return (
    <>
      <Dynamic
        component={props.isEditing ? "a" : Link}
        href={`/transactions/${props.transaction.id}`}
        onClick={(event) => {
          if (props.isEditing) {
            event.stopPropagation()
            event.preventDefault()
          }
        }}
      >
        <div
          class="flex items-center bg-white py-2 pr-4 shadow-sm"
          classList={{ "pl-10": props.parent, "pl-4": !props.parent }}
        >
          <RelationEditor
            parent={props.parent}
            transaction={props.transaction}
            includeInReports={includeInReports()}
            isEditing={props.isEditing}
          />

          <div class="ml-4 min-w-0 flex-1">
            {editingMemo() ? (
              <MemoEditor transaction={props.transaction} stopEditing={stopEditing} />
            ) : (
              <>
                <div
                  class="truncate leading-none"
                  classList={{ "text-gray-600 line-through": !includeInReports() }}
                  onClick={() => props.isEditing && setEditingMemo(true)}
                >
                  {props.transaction.memo}
                  <Show when={props.isEditing && includeInReports()}>
                    <EditableIndicator />
                  </Show>
                </div>
                <Show when={!parent && !props.isEditing}>
                  <div
                    class="truncate pt-1 text-xs uppercase leading-tight"
                    classList={{
                      "text-gray-600": includeInReports(),
                      "text-gray-300": !includeInReports()
                    }}
                  >
                    {props.transaction.accountMailbox?.name} / {props.transaction.originalMemo}
                  </div>
                </Show>
              </>
            )}
          </div>
          <div
            class="ml-2 whitespace-nowrap"
            classList={{ "text-gray-600 line-through": !includeInReports() }}
          >
            {props.transaction.amount.formatted}
          </div>
          {/* {props.isEditing && !parent && <SplitTransactionButton transaction={props.transaction} />}
          {props.isEditing && <VisibilityEditor transaction={props.transaction} />}
          {props.isEditing && <DeleteTransactionButton transaction={props.transaction} />} */}
        </div>
      </Dynamic>
      <For each={props.transaction.splitTo}>
        {(child: any) => (
          <TransactionItem
            transaction={child}
            parent={props.transaction}
            isEditing={props.isEditing}
          />
        )}
      </For>
    </>
  )
}

const EditableIndicator = () => (
  <div class="relative bottom-[-2px] ml-1 text-gray-600">
    <TbEdit />
  </div>
)

export default TransactionItem
