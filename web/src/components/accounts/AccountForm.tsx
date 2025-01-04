import { createForm, Field, Form, required, setValue } from "@modular-forms/solid"
import { IconSelector } from "@tabler/icons-solidjs"
import { Component } from "solid-js"
import { AccountInput, FullAccountFragment } from "../../graphql-types.ts"
import { Button } from "../base/Button.tsx"
import { FormControl, FormLabel } from "../base/FormControl.tsx"
import { CurrencySelect } from "../currencies/CurrencySelect.tsx"
import FormInput from "../forms/FormInput.tsx"

type AccountFormValues = AccountInput

const AccountForm: Component<{
  account?: FullAccountFragment | null
  onSave: (input: AccountInput, id?: string) => void
  loading: boolean
}> = (props) => {
  const [form] = createForm<AccountFormValues>({
    initialValues: {
      name: props.account?.name,
      currencyId: props.account?.currency.id
    }
  })

  const onSubmit = (values: AccountFormValues) => props.onSave({ ...values }, props?.account?.id)

  return (
    <Form of={form} onSubmit={onSubmit}>
      <FormInput of={form} label="Name" name="name" validate={required("Cannot be blank")} />

      <FormControl>
        <FormLabel>Currency</FormLabel>
        <Field of={form} name="currencyId">
          {(field) => (
            <CurrencySelect
              value={field.value || null}
              onChange={(id) => {
                setValue(form, "currencyId", id)
              }}
            >
              {(currency) => (
                <Button class="w-full">
                  <span class="flex-1 text-left">{currency?.code || "Select currency"}</span>
                  <IconSelector class="ml-1" />
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
