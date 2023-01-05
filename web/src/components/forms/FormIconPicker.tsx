import { Component, JSX } from "solid-js"
import { FormControl, FormLabel } from "../base/FormControl"
import IconPicker from "../IconPicker"

const FormIconPicker: Component<{
  label: JSX.Element
  name: string
  defaultValue?: string
}> = (props) => {
  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <IconPicker name={props.name} defaultValue={props.defaultValue} />
    </FormControl>
  )
}

export default FormIconPicker
