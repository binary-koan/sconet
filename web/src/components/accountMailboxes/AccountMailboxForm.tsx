import { createForm } from "@felte/solid"
import { validator } from "@felte/validator-superstruct"
import { Component } from "solid-js"
import { Describe, nonempty, nullable, object, optional, string } from "superstruct"
import { CreateAccountMailboxInput } from "../../graphql-types"
import { usedAsDirective } from "../../utils/usedAsDirective"
import { Button } from "../base/Button"
import FormInput from "../forms/FormInput"

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

    extend: validator({ struct: accountMailboxFormStruct }),

    initialValues: {
      name: props.accountMailbox?.name,
      fromAddressPattern: props.accountMailbox?.fromAddressPattern,
      datePattern: props.accountMailbox?.datePattern,
      memoPattern: props.accountMailbox?.memoPattern,
      amountPattern: props.accountMailbox?.amountPattern
    }
  })

  usedAsDirective(form)

  return (
    <form use:form>
      <FormInput label="Name" name="name" />
      <FormInput label="From address pattern" name="fromAddressPattern" />
      <FormInput label="Date pattern" name="datePattern" />
      <FormInput label="Memo pattern" name="memoPattern" />
      <FormInput label="Amount pattern" name="amountPattern" />

      <Button type="submit" colorScheme="primary" disabled={props.loading}>
        Save
      </Button>
    </form>
  )
}

export default AccountMailboxForm
