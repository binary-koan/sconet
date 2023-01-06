import { createForm, Form, required } from "@modular-forms/solid"
import { Component } from "solid-js"
import { CreateAccountMailboxInput } from "../../graphql-types"
import { Button } from "../base/Button"
import FormInput from "../forms/FormInput"

type AccountMailboxFormValues = Omit<CreateAccountMailboxInput, "mailServerOptions">

const AccountMailboxForm: Component<{
  accountMailbox?: any
  onSave: (input: CreateAccountMailboxInput, id?: string) => void
  loading: boolean
}> = (props) => {
  const form = createForm<AccountMailboxFormValues>({
    initialValues: {
      name: props.accountMailbox?.name,
      fromAddressPattern: props.accountMailbox?.fromAddressPattern,
      datePattern: props.accountMailbox?.datePattern,
      memoPattern: props.accountMailbox?.memoPattern,
      amountPattern: props.accountMailbox?.amountPattern
    }
  })

  const onSubmit = (values: AccountMailboxFormValues) =>
    props.onSave({ ...values, mailServerOptions: {} }, props?.accountMailbox?.id)

  return (
    <Form of={form} onSubmit={onSubmit}>
      <FormInput of={form} label="Name" name="name" validate={required("Cannot be blank")} />

      <FormInput of={form} label="From address pattern" name="fromAddressPattern" />
      <FormInput of={form} label="Date pattern" name="datePattern" />
      <FormInput of={form} label="Memo pattern" name="memoPattern" />
      <FormInput of={form} label="Amount pattern" name="amountPattern" />

      <Button type="submit" colorScheme="primary" disabled={props.loading}>
        Save
      </Button>
    </Form>
  )
}

export default AccountMailboxForm
