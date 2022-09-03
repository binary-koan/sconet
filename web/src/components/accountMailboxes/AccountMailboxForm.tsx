import { Button } from "@hope-ui/solid"
import { Component } from "solid-js"
import { CreateAccountMailboxMutationVariables } from "../../graphql-types"
import { Form } from "../forms/Form"
import FormInput from "../forms/FormInput"

interface AccountMailboxFormValues {
  name: string
  fromAddressPattern: string
  datePattern: string
  memoPattern: string
  amountPattern: string
}

const AccountMailboxForm: Component<{
  accountMailbox?: any
  onSave: (input: CreateAccountMailboxMutationVariables["input"], id?: string) => void
  loading: boolean
}> = (props) => {
  const onSave = (data: AccountMailboxFormValues) => {
    props.onSave({ ...data, mailServerOptions: {} }, props?.accountMailbox?.id)
  }

  return (
    <Form onSave={onSave}>
      <FormInput label="Name" name="name" defaultValue={props.accountMailbox?.name} />

      <FormInput
        label="From address pattern"
        name="fromAddressPattern"
        defaultValue={props.accountMailbox?.fromAddressPattern}
      />

      <FormInput
        label="Date pattern"
        name="datePattern"
        defaultValue={props.accountMailbox?.datePattern}
      />

      <FormInput
        label="Memo pattern"
        name="memoPattern"
        defaultValue={props.accountMailbox?.memoPattern}
      />

      <FormInput
        label="Amount pattern"
        name="amountPattern"
        defaultValue={props.accountMailbox?.amountPattern}
      />

      <Button type="submit" colorScheme="primary" disabled={props.loading}>
        Save
      </Button>
    </Form>
  )
}

export default AccountMailboxForm
