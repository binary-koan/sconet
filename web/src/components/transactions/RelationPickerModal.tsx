import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Heading,
  ModalFooter,
  Button
} from "@hope-ui/solid"
import { Component } from "solid-js"
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
    <Modal opened={props.isOpen} onClose={props.onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select</ModalHeader>
        <ModalCloseButton />

        <ModalBody paddingBottom={props.categoryProps.multiple ? "0" : "$8"}>
          {!props.isIncome && (
            <>
              <Heading size="sm" marginBottom="$4">
                {props.categoryProps.multiple ? "Categories" : "Category"}
              </Heading>
              <CategoryPicker {...props.categoryProps} />
            </>
          )}
          <Heading size="sm" marginTop="$6" marginBottom="$4">
            Account Mailbox
          </Heading>
          <AccountMailboxPicker {...props.accountMailboxProps} />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="primary" onClick={props.onClose}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default RelationPickerModal
