import { createForm, Form, required } from "@modular-forms/solid"
import { Component } from "solid-js"
import { Button } from "../base/Button"
import FormInput from "../forms/FormInput"

type CurrencyFormValues = {
  code: string
  name: string
  symbol: string
  decimalDigits: string
}

const CurrencyForm: Component<{
  onSave: (input: { code: string; name: string; symbol: string; decimalDigits: number }) => void
  loading: boolean
}> = (props) => {
  const [form] = createForm<CurrencyFormValues>({
    initialValues: {
      code: "",
      name: "",
      symbol: "",
      decimalDigits: "2"
    }
  })

  const onSubmit = (values: CurrencyFormValues) => {
    props.onSave({
      code: values.code,
      name: values.name,
      symbol: values.symbol,
      decimalDigits: parseInt(values.decimalDigits, 10)
    })
  }

  return (
    <Form of={form} onSubmit={onSubmit}>
      <FormInput of={form} label="Code" name="code" placeholder="e.g. USD" validate={required("Cannot be blank")} />
      <FormInput of={form} label="Name" name="name" placeholder="e.g. United States Dollar" validate={required("Cannot be blank")} />
      <FormInput of={form} label="Symbol" name="symbol" placeholder="e.g. $" validate={required("Cannot be blank")} />
      <FormInput of={form} label="Decimal digits" name="decimalDigits" type="number" inputmode="numeric" validate={required("Cannot be blank")} />

      <Button type="submit" colorScheme="primary" disabled={props.loading}>
        Save
      </Button>
    </Form>
  )
}

export default CurrencyForm
