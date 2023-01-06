import { Field, FormState, setValue, ValidateField } from "@modular-forms/solid"
import { Component, For, JSX, Show, splitProps } from "solid-js"
import { RefProp } from "../../types"
import { Button } from "../base/Button"
import { FormControl, FormLabel } from "../base/FormControl"
import { FieldError } from "./FieldError"

const FormOptionButtons: Component<{
  of: FormState<any>
  ref?: RefProp<HTMLDivElement>
  label?: JSX.Element
  name: string
  validate?: ValidateField<any> | ValidateField<any>[]
  multiple?: boolean
  options: Array<{
    value: string
    content: JSX.Element
    props?: any
    buttonProps?: any
  }>
}> = (props) => {
  return (
    <Field name={props.name} of={props.of} validate={props.validate}>
      {(field) => (
        <FormControl ref={props.ref}>
          <Show when={props.label}>
            <FormLabel>{props.label}</FormLabel>
          </Show>

          <select {...field.props} multiple={props.multiple} style={{ display: "none" }}>
            <For each={props.options}>
              {({ value }) => <option value={value} selected={field.value?.includes(value)} />}
            </For>
          </select>

          <div class="flex flex-wrap gap-1">
            <For each={props.options}>
              {({ value, content, props: boxProps, buttonProps }) => (
                <div {...boxProps}>
                  <OptionButton
                    name={props.name}
                    value={value}
                    currentValue={field.value}
                    setCurrentValue={(value) =>
                      setValue(
                        props.of,
                        props.name,
                        props.multiple ? toggleValue(value, field.value) : value
                      )
                    }
                    {...buttonProps}
                  >
                    {content}
                  </OptionButton>
                </div>
              )}
            </For>
          </div>

          <Show when={field.error}>
            <FieldError error={field.error} />
          </Show>
        </FormControl>
      )}
    </Field>
  )
}

export default FormOptionButtons

const toggleValue = (value: string, values: string[] = []) => {
  if (values.includes(value)) {
    return values.filter((item) => item !== value)
  } else {
    return values.concat(value)
  }
}

const OptionButton: Component<{
  name: string
  value: string
  currentValue: string | string[]
  setCurrentValue: (value: string) => void
  children: JSX.Element
}> = (allProps) => {
  const [props, otherProps] = splitProps(allProps, [
    "children",
    "name",
    "value",
    "currentValue",
    "setCurrentValue"
  ])

  const isCurrent = () =>
    Array.isArray(props.currentValue)
      ? props.currentValue.includes(props.value)
      : props.value === props.currentValue

  return (
    <Button
      size="sm"
      colorScheme={isCurrent() ? "primary" : "neutral"}
      onClick={[props.setCurrentValue, props.value]}
      {...otherProps}
    >
      {props.children}
    </Button>
  )
}
