import { Component } from "solid-js"
import RelationEditInput from "./RelationEditInput"

const RelationEditor: Component<{
  parent: any
  transaction: any
  includeInReports: boolean
  isEditing: boolean
}> = (props) => {
  // const [updateTransaction] = useMutation(UPDATE_TRANSACTION_MUTATION)

  // const doUpdateCategory = useCallback(
  //   async (category: { id: string }) => {
  //     await updateTransaction({
  //       variables: {
  //         id: transaction.id,
  //         input: { categoryId: category.id },
  //       },
  //     })
  //   },
  //   [transaction.id, updateTransaction]
  // )

  // const doUpdateAccountMailbox = useCallback(
  //   async (accountMailbox: { id: string }) => {
  //     await updateTransaction({
  //       variables: {
  //         id: transaction.id,
  //         input: { accountMailboxId: accountMailbox.id },
  //       },
  //     })
  //   },
  //   [transaction.id, updateTransaction]
  // )

  return (
    <RelationEditInput
      hasParent={Boolean(parent)}
      isIncome={props.transaction.amount.decimalAmount > 0}
      category={props.transaction.category}
      accountMailbox={props.transaction.accountMailbox}
      hasChildren={Boolean(props.transaction.splitTo?.length)}
      includeInReports={props.includeInReports}
      isEditing={props.isEditing}
      onChangeCategory={() => {}}
      onChangeAccountMailbox={() => {}}
    />
  )
}

export default RelationEditor
