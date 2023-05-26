import { TbArrowsSplit2, TbDotsVertical, TbEye, TbEyeOff, TbTrash } from "solid-icons/tb"
import { Component, Show, createSignal } from "solid-js"
import { ListingTransactionFragment } from "../../graphql-types"
import { useDeleteTransaction } from "../../graphql/mutations/deleteTransactionMutation"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { AlertModal } from "../AlertModal"
import { Dropdown, DropdownMenuItem } from "../Dropdown"
import { Button } from "../base/Button"
import { SplitTransactionModal } from "./SplitTransactionModal"

export const TransactionActions: Component<{ transaction: ListingTransactionFragment }> = (
  props
) => {
  const updateTransaction = useUpdateTransaction()
  const deleteTransaction = useDeleteTransaction()

  const [dropdownOpen, setDropdownOpen] = createSignal(false)
  const [splitModalVisible, setSplitModalVisible] = createSignal(false)
  const [deleteModalVisible, setDeleteModalVisible] = createSignal(false)

  const onToggle = (isOpen: boolean, event?: Event) => {
    event?.stopPropagation()
    event?.preventDefault()

    setDropdownOpen(isOpen)
  }

  return (
    <>
      <Dropdown
        isOpen={dropdownOpen()}
        onToggle={onToggle}
        placement="bottomRight"
        content={
          <>
            <DropdownMenuItem
              onClick={() => {
                setSplitModalVisible(true)
                onToggle(false)
              }}
            >
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

            <DropdownMenuItem
              onClick={() => {
                setDeleteModalVisible(true)
                onToggle(false)
              }}
            >
              <TbTrash /> Delete
            </DropdownMenuItem>
          </>
        }
      >
        <Button size="sm" variant="ghost" class="ml-2">
          <TbDotsVertical />
        </Button>
      </Dropdown>

      <Show when={splitModalVisible()}>
        <SplitTransactionModal
          isOpen={true}
          onClose={() => {
            setSplitModalVisible(false)
          }}
          onFinish={() => {
            setSplitModalVisible(false)
            setDropdownOpen(false)
          }}
          transaction={props.transaction}
        />
      </Show>

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
