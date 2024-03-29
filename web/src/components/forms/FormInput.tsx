import { Field, FormStore, ValidateField } from "@modular-forms/solid"
import { uniqueId } from "lodash"
import { Component, JSX, Show, splitProps } from "solid-js"
import { FormControl, FormLabel } from "../base/FormControl"
import { Input, InputProps } from "../base/Input"
import { FieldError } from "./FieldError"

const FormInput: Component<
  InputProps & {
    of: FormStore<any, any>
    label: JSX.Element
    placeholderLabel?: boolean
    name: string
    validate?: ValidateField<any> | ValidateField<any>[]
    wrapperClass?: string
  }
> = (allProps) => {
  const id = uniqueId("form-input-")

  const [props, inputProps] = splitProps(allProps, [
    "of",
    "label",
    "placeholderLabel",
    "name",
    "validate",
    "wrapperClass"
  ])

  return (
    <FormControl class={props.wrapperClass}>
      <FormLabel for={id} class={props.placeholderLabel ? "sr-only" : ""}>
        {props.label}
      </FormLabel>
      <Field name={props.name} of={props.of} validate={props.validate}>
        {(field, fieldProps) => (
          <>
            <Input
              id={id}
              class="w-full"
              placeholder={
                props.placeholderLabel && typeof props.label === "string" ? props.label : ""
              }
              value={field.value}
              {...inputProps}
              {...fieldProps}
              onBlur={inputProps.onBlur}
              ref={inputProps.ref}
            />
            <Show when={field.error}>
              <FieldError error={field.error} />
            </Show>
          </>
        )}
      </Field>
    </FormControl>
  )
}

export default FormInput
