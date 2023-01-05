import { Field, FormState, ValidateField } from "@modular-forms/solid"
import { Component, JSX, splitProps } from "solid-js"
import { FormControl, FormLabel } from "../base/FormControl"
import { Input, InputProps } from "../base/Input"

const FormInput: Component<
  InputProps & {
    of: FormState<any>
    label: JSX.Element
    name: string
    validate?: ValidateField<any> | ValidateField<any>[]
  }
> = (allProps) => {
  const [props, inputProps] = splitProps(allProps, ["of", "label", "name", "validate"])

  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <Field name={props.name} of={props.of} validate={props.validate}>
        {(field) => <Input class="w-full" {...inputProps} value={field.value} {...field.props} />}
      </Field>
    </FormControl>
  )
}

export default FormInput
