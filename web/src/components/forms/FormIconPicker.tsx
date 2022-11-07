import { JSX } from "solid-js"
import { FormControl, FormLabel } from "../base/FormControl"
import IconPicker from "../IconPicker"

const FormIconPicker = ({
  label,
  name,
  defaultValue
}: {
  label: JSX.Element
  name: string
  defaultValue?: string
}) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <IconPicker name={name} defaultValue={defaultValue} />
    </FormControl>
  )
}

export default FormIconPicker
