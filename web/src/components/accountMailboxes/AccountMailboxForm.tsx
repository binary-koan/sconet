import { Button } from "@hope-ui/solid"
import { Component } from "solid-js"
import { CreateAccountMailboxInput } from "../../graphql-types"
import FormInput from "../forms/FormInput"
import { createForm } from "@felte/solid"
import { validator } from "@felte/validator-superstruct"
import { Describe, nonempty, nullable, object, optional, string } from "superstruct"

type AccountMailboxFormValues = Omit<CreateAccountMailboxInput, "mailServerOptions">

const accountMailboxFormStruct: Describe<AccountMailboxFormValues> = object({
  name: nonempty(string()),
  fromAddressPattern: optional(nullable(string())),
  datePattern: optional(nullable(string())),
  memoPattern: optional(nullable(string())),
  amountPattern: optional(nullable(string()))
})

const AccountMailboxForm: Component<{
  accountMailbox?: any
  onSave: (input: CreateAccountMailboxInput, id?: string) => void
  loading: boolean
}> = (props) => {
  const { form } = createForm<AccountMailboxFormValues>({
    onSubmit: (values) => {
      props.onSave({ ...values, mailServerOptions: {} }, props?.accountMailbox?.id)
    },

    extend: validator({ struct: accountMailboxFormStruct })
  })

  return (
    <form use:form>
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
    </form>
  )
}

export default AccountMailboxForm
