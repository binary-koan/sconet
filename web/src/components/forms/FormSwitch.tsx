import { Field, FormStore, ValidateField, setValue } from "@modular-forms/solid"
import { Component, JSX, Show } from "solid-js"
import { FieldError } from "./FieldError.tsx"

const FormSwitch: Component<{
  of: FormStore<any, any>
  label: JSX.Element
  name: string
  validate?: ValidateField<any> | ValidateField<any>[]
}> = (props) => {
  return (
    <Field of={props.of} name={props.name} validate={props.validate}>
      {(field) => (
        <>
          <label class="relative mb-4 flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="peer sr-only"
              onChange={(e) => setValue(props.of, field.name, e.target.checked)}
              checked={field.value}
            />
            <div class="peer h-6 w-11 rounded-full bg-gray-200 transition after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-indigo-300" />
            <span class="ml-3 text-sm font-medium">{props.label}</span>
          </label>

          <Show when={field.error}>
            <FieldError error={field.error} />
          </Show>
        </>
      )}
    </Field>
  )
}

export default FormSwitch
