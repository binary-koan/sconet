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
import AccountMailboxPicker, {
  ValueProps as AccountMailboxValueProps
} from "./AccountMailboxPicker"
import CategoryPicker, { ValueProps as CategoryValueProps } from "./CategoryPicker"

const RelationPickerModal = ({
  isIncome,
  categoryProps,
  accountMailboxProps,
  onClose,
  isOpen
}: {
  isIncome: boolean
  categoryProps: CategoryValueProps
  accountMailboxProps: AccountMailboxValueProps
  isOpen: boolean
  onClose: () => void
}) => {
  return (
    <Modal opened={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select</ModalHeader>
        <ModalCloseButton />

        <ModalBody paddingBottom={categoryProps.multiple ? "0" : "$8"}>
          {!isIncome && (
            <>
              <Heading size="sm" marginBottom="$4">
                {categoryProps.multiple ? "Categories" : "Category"}
              </Heading>
              <CategoryPicker {...categoryProps} />
            </>
          )}
          <Heading size="sm" marginTop="$6" marginBottom="$4">
            Account Mailbox
          </Heading>
          <AccountMailboxPicker {...accountMailboxProps} />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="primary" onClick={onClose}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default RelationPickerModal
