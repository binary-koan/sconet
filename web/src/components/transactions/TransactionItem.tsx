import { useNavigate } from "@solidjs/router"
import { groupBy } from "lodash"
import { Component, createEffect, createSignal, Index, Show } from "solid-js"
import { FullTransactionFragment } from "../../graphql-types"
import { namedIcons } from "../../utils/namedIcons"
import CategoryIndicator from "../CategoryIndicator"
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

  const splitTo = () =>
    Object.values(groupBy(props.transaction.splitTo, (child) => child.category?.id)).map(
      (children) => ({
        category: children[0].category,
        count: children.length,
        memos:
          children
            .slice(0, 5)
            .map((child) => child.memo)
            .join(", ") + (children.length > 5 ? " ..." : "")
      })
    )

  return (
    <>
      <div
        class="flex items-center bg-white py-2 pr-4 shadow-sm"
        classList={{
          "pl-10": !!props.parent,
          "pl-4": !props.parent,
          "cursor-pointer": !props.isEditing
        }}
      >
        <div class="flex flex-1 items-center" onClick={navigateUnlessEditing}>
          <RelationEditor
            parent={props.parent}
            transaction={props.transaction}
            includeInReports={includeInReports()}
          />

          <div
            class="ml-2 min-w-0 flex-1 border-l"
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
              "text-gray-600 line-through": !includeInReports()
            }}
          >
            {props.transaction.amount.formatted}
          </div>
        </div>
        <Show when={!props.parent} fallback={<div class="w-10" />}>
          <TransactionActions transaction={props.transaction} />
        </Show>
      </div>
      <Index each={splitTo()}>
        {(child) => (
          <div
            onClick={navigateUnlessEditing}
            class="flex items-center bg-white py-2 pr-4 pl-10 shadow-sm"
            classList={{ "cursor-pointer": !props.isEditing }}
          >
            <CategoryIndicator
              class="mr-4 h-8 w-8 flex-none"
              iconSize="1.25em"
              icon={child().category?.icon ? namedIcons[child().category?.icon!] : undefined}
              color={child().category?.color}
              includeInReports={props.transaction.includeInReports}
              isIncome={props.transaction.amount.decimalAmount > 0}
            />

            <div class="mr-2 min-w-0 truncate text-sm">{child().memos}</div>

            <div class="ml-auto ml-auto mr-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-200 text-xs">
              {child().count}
            </div>
          </div>
        )}
      </Index>
    </>
  )
}

export default TransactionItem
