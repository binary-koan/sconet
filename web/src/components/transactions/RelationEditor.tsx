import { Component, JSX } from "solid-js"
import { ListingTransactionFragment, TransactionsQuery } from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { namedIcons } from "../../utils/namedIcons"
import { showAlert } from "../AlertManager"
import CategoryIndicator from "../CategoryIndicator"
import RelationEditInput from "./RelationEditInput"

type SplitTransaction = TransactionsQuery["transactions"]["data"][number]["splitTo"][number]

const RelationEditor: Component<{
  parent?: ListingTransactionFragment | null
  transaction: ListingTransactionFragment | SplitTransaction
  includeInReports?: boolean
  showAccount?: boolean
  showCategory?: boolean
  children?: JSX.Element
}> = (props) => {
  const updateTransaction = useUpdateTransaction()

  const updateCategory = async (category: { id: string }) => {
    await updateTransaction({
      id: props.transaction.id,
      input: { categoryId: category.id }
    })
  }

  const updateAccount = async (account: { id: string; currencyCode: string }) => {
    let confirmed = true

    if (
      "currencyCode" in props.transaction &&
      account.currencyCode !== props.transaction.currencyCode
    ) {
      confirmed = await showAlert({
        title: "Change account?",
        body: (
          <>
            Changing the account will change the currency of the transaction{" "}
            <strong>without</strong> currency conversion. Are you sure?
          </>
        )
      })
    }

    if (confirmed) {
      await updateTransaction({
        id: props.transaction.id,
        input: { accountId: account.id, currencyCode: account.currencyCode }
      })
    }
  }

  return (
    <RelationEditInput
      isIncome={props.transaction.amount.decimalAmount > 0}
      category={props.transaction.category ?? undefined}
      account={"account" in props.transaction ? props.transaction.account : undefined}
      showAccount={props.showAccount ?? true}
      showCategory={props.showCategory ?? true}
      onChangeCategory={updateCategory}
      onChangeAccount={updateAccount}
    >
      {props.children || (
        <CategoryIndicator
          class={props.parent ? "h-8 w-8" : "h-10 w-10"}
          iconSize="1.25em"
          icon={
            props.transaction.category?.icon
              ? namedIcons[props.transaction.category?.icon]
              : undefined
          }
          color={props.transaction.category?.color}
          isSplit={"splitTo" in props.transaction && props.transaction.splitTo?.length > 0}
          includeInReports={props.includeInReports}
          isIncome={props.transaction.amount.decimalAmount > 0}
        />
      )}
    </RelationEditInput>
  )
}

export default RelationEditor
