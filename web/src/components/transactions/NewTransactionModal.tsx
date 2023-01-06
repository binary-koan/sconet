import { Component } from "solid-js"
import toast from "solid-toast"
import { CreateTransactionInput } from "../../graphql-types"
import { useCreateTransaction } from "../../graphql/mutations/createTransactionMutation"
import { Button } from "../base/Button"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal"

export const NewTransactionModal: Component<{ isOpen: boolean; onClose: () => void }> = (props) => {
  const createTransaction = useCreateTransaction({
    onSuccess: () => {
      toast.success("Transaction created")
      props.onClose()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSave = (input: CreateTransactionInput) => {
    createTransaction({ input })
  }

  return (
    <Modal isOpen={props.isOpen} onClickOutside={props.onClose}>
      <ModalContent>
        <ModalTitle>
          New Transaction <ModalCloseButton onClick={props.onClose} />
        </ModalTitle>

        <div>
          <span>No category</span>
          <span>Expense</span>
          <span>NZD</span>
          <span>Test account</span>
        </div>

        {/* <FormInput label="Memo" name="memo" />
        <FormDatePicker label="Date" name="date" defaultValue={new Date()} />
        <FormInput label="Amount" name="amount" /> */}

        <Button
          type="submit"
          colorScheme="primary"
          class="w-full"
          disabled={createTransaction.loading}
        >
          Save
        </Button>
      </ModalContent>
    </Modal>
  )
}
