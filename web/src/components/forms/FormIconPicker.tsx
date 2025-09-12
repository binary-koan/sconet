import { Field, FormStore, setValue } from "@modular-forms/solid"
import { Component, JSX, Show } from "solid-js"
import IconPicker from "../IconPicker"
import { FormControl, FormLabel } from "../base/FormControl"
import { FieldError } from "./FieldError"

const FormIconPicker: Component<{
  of: FormStore<any, any>
  label: JSX.Element
  name: string
}> = (props) => {
  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <Field of={props.of} name={props.name}>
        {(field) => (
          <>
            <IconPicker
              name={field.name}
              value={field.value}
              setValue={(value) => setValue(props.of, field.name, value)}
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

export default FormIconPicker
