import { TbArrowsSplit2, TbEye, TbEyeOff, TbTrash } from "solid-icons/tb"
import { Component, createSignal, Show } from "solid-js"
import { FullTransactionFragment } from "../../graphql-types"
import { useDeleteTransaction } from "../../graphql/mutations/deleteTransactionMutation"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { AlertModal } from "../AlertModal"
import { DropdownMenuItem } from "../Dropdown"

export const TransactionActions: Component<{ transaction: FullTransactionFragment }> = (props) => {
  const updateTransaction = useUpdateTransaction()
  const deleteTransaction = useDeleteTransaction()

  const [deleteModalVisible, setDeleteModalVisible] = createSignal(false)

  return (
    <>
      <DropdownMenuItem>
        <TbArrowsSplit2 /> Split transaction
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() =>
          updateTransaction({
            id: props.transaction.id,
            input: { includeInReports: !props.transaction.includeInReports }
          })
        }
      >
        {props.transaction.includeInReports ? (
          <>
            <TbEyeOff /> Hide from reports
          </>
        ) : (
          <>
            <TbEye /> Show in reports
          </>
        )}
      </DropdownMenuItem>

      <DropdownMenuItem onClick={() => setDeleteModalVisible(true)}>
        <TbTrash /> Delete
      </DropdownMenuItem>

      <Show when={deleteModalVisible()}>
        <AlertModal
          isOpen={true}
          title="Delete transaction"
          body="Are you sure you want to delete this transaction?"
          buttons={[
            {
              colorScheme: "danger",
              content: "Delete",
              onClick: () => deleteTransaction({ id: props.transaction.id })
            },
            {
              colorScheme: "neutral",
              content: "Cancel",
              onClick: () => setDeleteModalVisible(false)
            }
          ]}
        />
      </Show>
    </>
  )
}
