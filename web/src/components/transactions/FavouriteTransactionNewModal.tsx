import { Component } from "solid-js"
import toast from "solid-toast"
import { Button } from "../base/Button"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal"
import { Form, createForm, Field, getValue, setValue } from "@modular-forms/solid"
import FormInput from "../forms/FormInput"
import { AccountSelect } from "../accounts/AccountSelect"
import FormSwitch from "../forms/FormSwitch"
import { useFavouriteTransactionUpsert } from "../../graphql/mutations/favouriteTransactionUpsert"

type NewFavouriteValues = {
  name: string
  shop: string
  memo?: string
  price?: string
  includePrice: boolean
  includeAccount: boolean
  accountId?: string | null
}

export const FavouriteTransactionNewModal: Component<{
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}> = (props) => {
  const [form] = createForm<NewFavouriteValues>({
    initialValues: {
      name: "",
      shop: "",
      memo: "",
      price: "",
      includePrice: false,
      includeAccount: false,
      accountId: null
    }
  })

  const upsert = useFavouriteTransactionUpsert({
    onSuccess: () => {
      toast.success("Favourite saved")
      props.onCreated()
      props.onClose()
    }
  })

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalContent>
        <ModalTitle>
          New favourite transaction
          <ModalCloseButton onClick={props.onClose} />
        </ModalTitle>

        <Form
          of={form}
          onSubmit={({ includeAccount, includePrice, price, ...values }) => {
            const priceCents = includePrice && price ? Math.round(parseFloat(price) * 100) : null
            upsert({
              ...values,
              priceCents,
              accountId: includeAccount ? values.accountId || null : null
            })
          }}
        >
          <FormInput of={form} name="name" label="Name" placeholder="e.g. Weekly groceries" />
          <FormInput of={form} name="shop" label="Shop" placeholder="e.g. AEON" />
          <FormInput of={form} name="memo" label="Memo" placeholder="Optional" />

          <FormSwitch of={form} name="includePrice" label="Include price" />
          <div classList={{ hidden: !getValue(form, "includePrice") }}>
            <FormInput
              of={form}
              name="price"
              label="Price"
              inputmode="decimal"
              placeholder="e.g. 1200.00"
            />
          </div>

          <FormSwitch of={form} name="includeAccount" label="Include account" />
          <div classList={{ hidden: !getValue(form, "includeAccount") }}>
            <Field of={form} name="accountId">
              {(field) => (
                <AccountSelect
                  value={field.value || null}
                  onChange={(account) => setValue(form, "accountId", account.id)}
                >
                  {(account) => (
                    <Button size="sm" variant="solid" class="w-full justify-start">
                      {account ? `${account.name} (${account.currency.code})` : "Select account"}
                    </Button>
                  )}
                </AccountSelect>
              )}
            </Field>
          </div>

          <Button type="submit" colorScheme="primary" loading={upsert.loading} class="mt-4">
            Save
          </Button>
        </Form>
      </ModalContent>
    </Modal>
  )
}
