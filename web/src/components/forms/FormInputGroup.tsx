import { Field, FormStore, ValidateField } from "@modular-forms/solid"
import { uniqueId } from "lodash"
import { Component, JSX, Show, splitProps } from "solid-js"
import { FormControl, FormLabel } from "../base/FormControl.tsx"
import { InputProps } from "../base/Input.tsx"
import { InputGroup, InputGroupInput } from "../base/InputGroup.tsx"
import { FieldError } from "./FieldError.tsx"

const FormInputGroup: Component<
  InputProps & {
    of: FormStore<any, any>
    label: JSX.Element
    name: string
    validate?: ValidateField<any> | ValidateField<any>[]
    before?: JSX.Element
    after?: JSX.Element
    placeholderLabel?: boolean
  }
> = (allProps) => {
  const id = uniqueId("form-input-group-")

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
      <FormLabel for={id} class={props.placeholderLabel ? "sr-only" : ""}>
        {props.label}
      </FormLabel>
      <Field name={props.name} of={props.of} validate={props.validate}>
        {(field, fieldProps) => (
          <>
            <InputGroup>
              {props.before}
              <InputGroupInput
                id={id}
                {...inputProps}
                value={field.value}
                placeholder={
                  props.placeholderLabel && typeof props.label === "string" ? props.label : ""
                }
                {...fieldProps}
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
