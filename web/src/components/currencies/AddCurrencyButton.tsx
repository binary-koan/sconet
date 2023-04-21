import { createForm, Form } from "@modular-forms/solid"
import { Component, createSignal, Show } from "solid-js"
import toast from "solid-toast"
import { useCreateCurrency } from "../../graphql/mutations/createCurrencyMutation"
import { Button } from "../base/Button"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal"
import FormInput from "../forms/FormInput"

type CurrencyFormValues = {
  code: string
  symbol: string
  decimalDigits: number
}

export const AddCurrencyButton: Component = () => {
  const [modalOpen, setModalOpen] = createSignal(false)
  const createCurrency = useCreateCurrency({
    onSuccess: () => {
      toast.success("Currency created.")
      setModalOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const [form] = createForm<CurrencyFormValues>()

  const onSubmit = (values: CurrencyFormValues) => {
    createCurrency({ input: values })
  }

  return (
    <>
      <Button class="ml-auto" size="sm" colorScheme="primary" onClick={() => setModalOpen(true)}>
        Add Currency
      </Button>
      <Show when={modalOpen()}>
        <Modal isOpen={true}>
          <ModalContent>
            <ModalTitle>
              Add Currency
              <ModalCloseButton onClick={() => setModalOpen(false)} />
            </ModalTitle>
            <Form of={form} onSubmit={onSubmit}>
              <FormInput of={form} name="code" label="Code" />
              <FormInput of={form} name="symbol" label="Symbol" />
              <FormInput of={form} type="number" name="decimalDigits" label="Decimal digits" />
              <Button type="submit">Save</Button>
            </Form>
          </ModalContent>
        </Modal>
      </Show>
    </>
  )
}
