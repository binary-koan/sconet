import { useNavigate } from "@solidjs/router"
import { Component, createEffect, createSignal, For, Show } from "solid-js"
import { FullTransactionFragment } from "../../graphql-types"
import MemoEditor from "./MemoEditor"
import RelationEditor from "./RelationEditor"
import { TransactionActions } from "./TransactionActions"

const TransactionItem: Component<{
  transaction: FullTransactionFragment
  parent?: FullTransactionFragment
  isEditing: boolean
}> = (props) => {
  const navigate = useNavigate()
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

  const navigateUnlessEditing = (event: MouseEvent) => {
    if (props.isEditing) {
      event.stopPropagation()
      event.preventDefault()
    } else {
      navigate(`/transactions/${props.transaction.id}`)
    }
  }

  return (
    <>
      <div
        onClick={navigateUnlessEditing}
        class="flex items-center bg-white py-2 pr-4 shadow-sm"
        classList={{
          "pl-10": !!props.parent,
          "pl-4": !props.parent,
          "cursor-pointer": !props.isEditing
        }}
      >
        <RelationEditor
          parent={props.parent}
          transaction={props.transaction}
          includeInReports={includeInReports()}
          isEditing={props.isEditing}
        />

        <div
          class="ml-2 min-w-0 flex-1 border-x"
          classList={{
            "border-gray-200": props.isEditing && !editingMemo(),
            "border-transparent": !props.isEditing || editingMemo(),
            "px-2": !editingMemo(),
            "-my-1": editingMemo()
          }}
        >
          <Show
            when={editingMemo()}
            fallback={
              <>
                <div
                  class="truncate leading-none"
                  classList={{ "text-gray-600 line-through": !includeInReports() }}
                  onClick={() => props.isEditing && setEditingMemo(true)}
                >
                  {props.transaction.memo}
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
            }
          >
            <MemoEditor transaction={props.transaction} stopEditing={stopEditing} />
          </Show>
        </div>
        <div
          class="ml-2 whitespace-nowrap"
          classList={{
            "text-gray-600 line-through": !includeInReports(),
            "pr-2 border-r border-gray-200": props.isEditing
          }}
        >
          {props.transaction.amount.formatted}
        </div>
        <Show when={props.isEditing && !props.parent}>
          <TransactionActions transaction={props.transaction} />
        </Show>

        {/* {props.isEditing && !parent && <SplitTransactionButton transaction={props.transaction} />}
          {props.isEditing && <VisibilityEditor transaction={props.transaction} />}
          {props.isEditing && <DeleteTransactionButton transaction={props.transaction} />} */}
      </div>
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

export default TransactionItem
