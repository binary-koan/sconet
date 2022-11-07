import { Component, JSX } from "solid-js"
import { FormControl, FormLabel } from "../base/FormControl"
import { Input, InputProps } from "../base/Input"

const FormInput: Component<{
  label: JSX.Element
  name: string
  type?: string
  defaultValue?: string | number
  render?: (inputProps: any) => JSX.Element
}> = (props) => {
  return (
    <FormControl>
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
  return <Input value={props.defaultValue} class="w-full" {...props} />
}

export default FormInput
