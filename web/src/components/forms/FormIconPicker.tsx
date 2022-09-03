import { FormControl, FormLabel } from "@hope-ui/solid"
import { JSX } from "solid-js"
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
    <FormControl marginBottom="$4">
      <FormLabel>{label}</FormLabel>
      <IconPicker name={name} defaultValue={defaultValue} />
    </FormControl>
  )
}

export default FormIconPicker
