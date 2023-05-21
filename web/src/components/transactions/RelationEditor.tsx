import { Component } from "solid-js"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import RelationEditInput from "./RelationEditInput"

const RelationEditor: Component<{
  parent: any
  transaction: any
  includeInReports: boolean
}> = (props) => {
  const updateTransaction = useUpdateTransaction()

  const updateCategory = async (category: { id: string }) => {
    await updateTransaction({
      id: props.transaction.id,
      input: { categoryId: category.id }
    })
  }

  const updateAccount = async (account: { id: string }) => {
    await updateTransaction({
      id: props.transaction.id,
      input: { accountId: account.id }
    })
  }

  return (
    <RelationEditInput
      hasParent={Boolean(parent)}
      isIncome={props.transaction.amount.decimalAmount > 0}
      category={props.transaction.category}
      account={props.transaction.account}
      hasChildren={Boolean(props.transaction.splitTo?.length)}
      includeInReports={props.includeInReports}
      onChangeCategory={updateCategory}
      onChangeAccount={updateAccount}
    />
  )
}

export default RelationEditor
