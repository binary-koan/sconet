import { Component, Show } from "solid-js"
import { Button } from "../base/Button"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal"
import AccountMailboxPicker, {
  ValueProps as AccountMailboxValueProps
} from "./AccountMailboxPicker"
import CategoryPicker, { ValueProps as CategoryValueProps } from "./CategoryPicker"

const RelationPickerModal: Component<{
  isIncome: boolean
  categoryProps: CategoryValueProps
  accountMailboxProps: AccountMailboxValueProps
  isOpen: boolean
  onClose: () => void
}> = (props) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalContent>
        <ModalTitle>
          Select <ModalCloseButton onClick={props.onClose} />
        </ModalTitle>

        <div class="mb-8">
          <Show when={!props.isIncome}>
            <h3 class="mb-4 font-semibold">
              {props.categoryProps.multiple ? "Categories" : "Category"}
            </h3>
            <CategoryPicker {...props.categoryProps} />
          </Show>
          <h3 class="mt-6 mb-4 font-semibold">Account Mailbox</h3>
          <AccountMailboxPicker {...props.accountMailboxProps} />
        </div>

        <Button colorScheme="primary" onClick={props.onClose}>
          Done
        </Button>
      </ModalContent>
    </Modal>
  )
}

export default RelationPickerModal
