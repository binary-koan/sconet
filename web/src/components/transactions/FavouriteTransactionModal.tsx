import { createForm, Form } from "@modular-forms/solid"
import { Component } from "solid-js"
import toast from "solid-toast"
import { FullTransactionFragment } from "../../graphql-types"
import { useFavouriteTransactionUpsert } from "../../graphql/mutations/favouriteTransactionUpsert"
import { Button } from "../base/Button"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal"
import FormInput from "../forms/FormInput"
import FormSwitch from "../forms/FormSwitch"

type FavouriteValues = {
  name: string
  includeMemo: boolean
  includePrice: boolean
  includeAccount: boolean
}

export const FavouriteTransactionModal: Component<{
  isOpen: boolean
  onClose: () => void
  transaction: FullTransactionFragment
}> = (props) => {
  const [form] = createForm<FavouriteValues>({
    initialValues: {
      name: props.transaction.shop,
      includeMemo: true,
      includePrice: true,
      includeAccount: true
    }
  })

  const upsert = useFavouriteTransactionUpsert({
    onSuccess() {
      toast.success("Favourite saved")
      props.onClose()
    }
  })

  return (
    <Modal isOpen={props.isOpen}>
      <ModalContent>
        <ModalTitle>
          Save favourite
          <ModalCloseButton onClick={props.onClose} />
        </ModalTitle>

        <Form
          of={form}
          onSubmit={({ includeAccount, includeMemo, includePrice, ...values }) => {
            const factor = Math.pow(10, props.transaction.currency?.decimalDigits || 2)
            const priceCents = Math.round(props.transaction.amount?.amountDecimal || 0 * factor)
            upsert({
              name: values.name,
              shop: props.transaction.shop,
              memo: includeMemo ? props.transaction.memo : "",
              priceCents: includePrice ? priceCents : null,
              accountId: includeAccount ? props.transaction.account.id : null
            })
          }}
        >
          <div class="flex flex-col gap-4">
            <FormInput of={form} name="name" label="Name" />
            <FormSwitch of={form} name="includeMemo" label="Include memo" />
            <FormSwitch of={form} name="includePrice" label="Include price" />
            <FormSwitch of={form} name="includeAccount" label="Include account" />
            <Button type="submit" colorScheme="primary" loading={upsert.loading}>
              Save
            </Button>
          </div>
        </Form>
      </ModalContent>
    </Modal>
  )
}
