import { FormControl, FormLabel, Input, InputProps } from "@hope-ui/solid"
import { Component, JSX } from "solid-js"

const FormInput: Component<{
  label: JSX.Element
  name: string
  type?: string
  defaultValue?: string | number
  render?: (inputProps: any) => JSX.Element
}> = (props) => {
  return (
    <FormControl marginBottom="$4">
      <FormLabel>{props.label}</FormLabel>
      {(props.render || defaultRender)({
        type: props.type,
        defaultValue: props.defaultValue,
        name: props.name
      })}
    </FormControl>
  )
}

const defaultRender: Component<InputProps & { defaultValue: any }> = (props) => {
  return <Input value={props.defaultValue} {...props} />
}

export default FormInput
