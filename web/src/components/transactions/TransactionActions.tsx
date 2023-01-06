import { TbArrowsSplit2, TbDots, TbEye, TbEyeOff, TbTrash } from "solid-icons/tb"
import { Component, createSignal, Show } from "solid-js"
import { FullTransactionFragment } from "../../graphql-types"
import { useDeleteTransaction } from "../../graphql/mutations/deleteTransactionMutation"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { AlertModal } from "../AlertModal"
import { Button } from "../base/Button"
import { Dropdown, DropdownMenuItem } from "../Dropdown"
import { SplitTransactionModal } from "./SplitTransactionModal"

export const TransactionActions: Component<{ transaction: FullTransactionFragment }> = (props) => {
  const updateTransaction = useUpdateTransaction()
  const deleteTransaction = useDeleteTransaction()

  const [dropdownOpen, setDropdownOpen] = createSignal(false)
  const [splitModalVisible, setSplitModalVisible] = createSignal(false)
  const [deleteModalVisible, setDeleteModalVisible] = createSignal(false)

  return (
    <Dropdown
      isOpen={dropdownOpen()}
      onToggle={(isOpen) => setDropdownOpen(isOpen)}
      placement="bottomRight"
      content={
        <>
          <DropdownMenuItem onClick={() => setSplitModalVisible(true)}>
            <TbArrowsSplit2 /> Split transaction
          </DropdownMenuItem>

          <Show when={splitModalVisible()}>
            <SplitTransactionModal
              isOpen={true}
              onClose={() => setSplitModalVisible(false)}
              onFinish={() => {
                setSplitModalVisible(false)
                setDropdownOpen(false)
              }}
              transaction={props.transaction}
            />
          </Show>

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
      }
    >
      <Button size="sm" variant="ghost" class="ml-2">
        <TbDots />
      </Button>
    </Dropdown>
  )
}
