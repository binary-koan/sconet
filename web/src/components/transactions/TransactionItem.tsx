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
        class="flex cursor-pointer items-center bg-white py-2 pr-4"
        classList={{
          "pl-10": !!props.parent,
          "pl-4": !props.parent
        }}
        data-testid="transaction-item"
      >
        <div class="flex min-w-0 flex-1 items-center" onClick={navigateToTransaction}>
          <RelationEditor
            parent={props.parent}
            transaction={props.transaction}
            includeInReports={includeInReports()}
          />

          <div
            class="ml-2 min-w-0 flex-1 truncate px-2 leading-none"
            classList={{ "text-gray-600 line-through": !includeInReports() }}
            data-testid="memo"
          >
            {props.transaction.shop}{" "}
            {props.transaction.memo && (
              <span class="text-gray-600">&ndash; {props.transaction.memo}</span>
            )}
          </div>
          <div
            class="ml-2 whitespace-nowrap text-right"
            classList={{
              "text-gray-600 line-through": !includeInReports()
            }}
            data-testid="amount"
          >
            {props.transaction.amount?.formatted ?? <em>Pending</em>}

            <Show when={props.transaction.shopAmount}>
              {(shopAmount) => (
                <div class="ml-1 text-xs text-gray-600">{shopAmount().formatted}</div>
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
            class="-mt-px flex cursor-pointer items-center bg-white py-2 pl-10 pr-4"
          >
            <CategoryIndicator
              class="mr-4 h-6 w-6 flex-none"
              iconSize="1.25em"
              icon={child().category?.icon ? namedIcons[child().category!.icon!] : undefined}
              color={child().category?.color}
              includeInReports={props.transaction.includeInReports}
              isIncome={Boolean(
                props.transaction.amount && props.transaction.amount.amountDecimal > 0
              )}
            />

            <div class="mr-2 min-w-0 truncate text-sm">{child().memos}</div>

            <div class="ml-auto mr-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-200 text-xs">
              {child().count}
            </div>
          </div>
        )}
      </Index>
    </>
  )
}

export default TransactionItem
