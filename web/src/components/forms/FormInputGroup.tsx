import { Field, FormState, ValidateField } from "@modular-forms/solid"
import { Component, JSX, Show, splitProps } from "solid-js"
import { FormControl, FormLabel } from "../base/FormControl"
import { InputProps } from "../base/Input"
import { InputGroup, InputGroupInput } from "../base/InputGroup"
import { FieldError } from "./FieldError"

const FormInputGroup: Component<
  InputProps & {
    of: FormState<any>
    label: JSX.Element
    name: string
    validate?: ValidateField<any> | ValidateField<any>[]
    before?: JSX.Element
    after?: JSX.Element
    placeholderLabel?: boolean
  }
> = (allProps) => {
  const [props, inputProps] = splitProps(allProps, [
    "of",
    "label",
    "name",
    "before",
    "after",
    "validate",
    "placeholderLabel",
    "ref"
  ])

  return (
    <FormControl>
      <FormLabel class={props.placeholderLabel ? "sr-only" : ""}>{props.label}</FormLabel>
      <Field name={props.name} of={props.of} validate={props.validate}>
        {(field) => (
          <>
            <InputGroup>
              {props.before}
              <InputGroupInput
                {...inputProps}
                value={field.value}
                placeholder={
                  props.placeholderLabel && typeof props.label === "string" ? props.label : ""
                }
                {...field.props}
                ref={props.ref}
              />
              {props.after}
            </InputGroup>
            <Show when={field.error}>
              <FieldError error={field.error} />
            </Show>
          </>
        )}
      </Field>
    </FormControl>
  )
}

export default FormInputGroup
