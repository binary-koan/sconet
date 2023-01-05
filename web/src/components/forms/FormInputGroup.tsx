import { Field, FormState, ValidateField } from "@modular-forms/solid"
import { Component, JSX, splitProps } from "solid-js"
import { FormControl, FormLabel } from "../base/FormControl"
import { InputProps } from "../base/Input"
import { InputGroup, InputGroupInput } from "../base/InputGroup"

const FormInputGroup: Component<
  InputProps & {
    of: FormState<any>
    label: JSX.Element
    name: string
    validate?: ValidateField<any> | ValidateField<any>[]
    before?: JSX.Element
    after?: JSX.Element
  }
> = (allProps) => {
  const [props, inputProps] = splitProps(allProps, [
    "of",
    "label",
    "name",
    "before",
    "after",
    "validate"
  ])

  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <Field name={props.name} of={props.of} validate={props.validate}>
        {(field) => (
          <InputGroup>
            {props.before}
            <InputGroupInput {...inputProps} value={field.value} {...field.props} />
            {props.after}
          </InputGroup>
        )}
      </Field>
    </FormControl>
  )
}

export default FormInputGroup
