import { FormControl, FormLabel, Switch } from "@hope-ui/solid"
import { Component, JSX } from "solid-js"

const FormSwitch: Component<{
  label: JSX.Element
  name: string
  defaultValue?: boolean
}> = (props) => {
  return (
    <FormControl marginBottom="$4">
      <FormLabel>{props.label}</FormLabel>
      <Switch name={props.name} defaultChecked={props.defaultValue} colorScheme="primary" />
    </FormControl>
  )
}

export default FormSwitch
