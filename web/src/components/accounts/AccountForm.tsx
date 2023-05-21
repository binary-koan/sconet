import { createForm, Form, required } from "@modular-forms/solid"
import { Component } from "solid-js"
import { CreateAccountInput } from "../../graphql-types"
import { Button } from "../base/Button"
import FormInput from "../forms/FormInput"

type AccountFormValues = CreateAccountInput

const AccountForm: Component<{
  account?: any
  onSave: (input: CreateAccountInput, id?: string) => void
  loading: boolean
}> = (props) => {
  const [form] = createForm<AccountFormValues>({
    initialValues: {
      name: props.account?.name
    }
  })

  const onSubmit = (values: AccountFormValues) => props.onSave({ ...values }, props?.account?.id)

  return (
    <Form of={form} onSubmit={onSubmit}>
      <FormInput of={form} label="Name" name="name" validate={required("Cannot be blank")} />

      <Button type="submit" colorScheme="primary" disabled={props.loading}>
        Save
      </Button>
    </Form>
  )
}

export default AccountForm
