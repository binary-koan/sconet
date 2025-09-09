import { Component, Show } from "solid-js"
import { Button } from "../base/Button.tsx"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal.tsx"
import AccountPicker, { ValueProps as AccountValueProps } from "./AccountPicker.tsx"
import CategoryPicker, { ValueProps as CategoryValueProps } from "./CategoryPicker.tsx"

const RelationPickerModal: Component<{
  isIncome: boolean
  categoryProps?: CategoryValueProps
  accountProps?: AccountValueProps
  isOpen: boolean
  onClose: () => void
}> = (props) => {
  return (
    <Modal isOpen={props.isOpen} onClickOutside={props.onClose}>
      <ModalContent>
        <ModalTitle>
          Select <ModalCloseButton onClick={props.onClose} />
        </ModalTitle>

        <div class="mb-8">
          <Show when={props.categoryProps && !props.isIncome}>
            <h3 class="mb-4 font-semibold">
              {props.categoryProps!.multiple ? "Categories" : "Category"}
            </h3>
            <CategoryPicker {...props.categoryProps!} />
          </Show>
          <Show when={props.accountProps}>
            <h3 class="mt-6 mb-4 font-semibold">Account</h3>
            <AccountPicker {...props.accountProps!} />
          </Show>
        </div>

        <Button colorScheme="primary" onClick={props.onClose}>
          Done
        </Button>
      </ModalContent>
    </Modal>
  )
}

export default RelationPickerModal
