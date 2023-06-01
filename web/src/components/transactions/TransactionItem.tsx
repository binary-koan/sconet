import { useNavigate } from "@solidjs/router"
import { groupBy } from "lodash"
import { Component, Index, Show } from "solid-js"
import { ListingTransactionFragment } from "../../graphql-types"
import { namedIcons } from "../../utils/namedIcons"
import CategoryIndicator from "../CategoryIndicator"
import RelationEditor from "./RelationEditor"
import { TransactionActions } from "./TransactionActions"

const TransactionItem: Component<{
  transaction: ListingTransactionFragment
  parent?: ListingTransactionFragment
}> = (props) => {
  const navigate = useNavigate()

  const includeInReports = () =>
    Boolean(
      props.transaction.includeInReports ||
        props.transaction.splitTo?.some((child: any) => child.includeInReports)
    )

  const navigateToTransaction = () => {
    navigate(`/transactions/${props.transaction.id}`)
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
        class="flex cursor-pointer items-center bg-white py-2 pr-4 shadow-sm"
        classList={{
          "pl-10": !!props.parent,
          "pl-4": !props.parent
        }}
        data-testid="transaction-item"
      >
        <div class="flex flex-1 items-center" onClick={navigateToTransaction}>
          <RelationEditor
            parent={props.parent}
            transaction={props.transaction}
            includeInReports={includeInReports()}
          />

          <div class="ml-2 min-w-0 flex-1 px-2">
            <div
              class="truncate leading-none"
              classList={{ "text-gray-600 line-through": !includeInReports() }}
              data-testid="memo"
            >
              {props.transaction.memo}
            </div>
          </div>
          <div
            class="ml-2 whitespace-nowrap text-right"
            classList={{
              "text-gray-600 line-through": !includeInReports()
            }}
            data-testid="amount"
          >
            {props.transaction.amount.formatted}

            <Show when={props.transaction.originalAmount}>
              {(originalAmount) => (
                <div class="ml-1 text-xs text-gray-600">{originalAmount().formatted}</div>
              )}
            </Show>
          </div>
        </div>
        <Show when={!props.parent} fallback={<div class="w-10" />}>
          <TransactionActions transaction={props.transaction} />
        </Show>
      </div>
      <Index each={splitTo()}>
        {(child) => (
          <div
            onClick={navigateToTransaction}
            class="flex cursor-pointer items-center bg-white py-2 pl-10 pr-4 shadow-sm"
          >
            <CategoryIndicator
              class="mr-4 h-8 w-8 flex-none"
              iconSize="1.25em"
              icon={child().category?.icon ? namedIcons[child().category!.icon!] : undefined}
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
