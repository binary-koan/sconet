import { createForm, Field, Form, required, setValue } from "@modular-forms/solid"
import { TbSelector } from "solid-icons/tb"
import { Component } from "solid-js"
import { CreateAccountInput, FullAccountFragment } from "../../graphql-types"
import { Button } from "../base/Button"
import { FormControl, FormLabel } from "../base/FormControl"
import { CurrencySelect } from "../currencies/CurrencySelect"
import FormInput from "../forms/FormInput"

type AccountFormValues = CreateAccountInput

const AccountForm: Component<{
  account?: FullAccountFragment | null
  onSave: (input: CreateAccountInput, id?: string) => void
  loading: boolean
}> = (props) => {
  const [form] = createForm<AccountFormValues>({
    initialValues: {
      name: props.account?.name,
      currencyCode: props.account?.currencyCode
    }
  })

  const onSubmit = (values: AccountFormValues) => props.onSave({ ...values }, props?.account?.id)

  return (
    <Form of={form} onSubmit={onSubmit}>
      <FormInput of={form} label="Name" name="name" validate={required("Cannot be blank")} />

      <FormControl>
        <FormLabel>Currency</FormLabel>
        <Field of={form} name="currencyCode">
          {(field) => (
            <CurrencySelect
              value={field.value}
              onChange={(code) => {
                setValue(form, "currencyCode", code)
              }}
            >
              {(currency) => (
                <Button class="w-full">
                  <span class="flex-1 text-left">{currency?.code || "Select currency"}</span>
                  <TbSelector class="ml-1" />
                </Button>
              )}
            </CurrencySelect>
          )}
        </Field>
      </FormControl>

      <Button type="submit" colorScheme="primary" disabled={props.loading}>
        Save
      </Button>
    </Form>
  )
}

export default AccountForm
