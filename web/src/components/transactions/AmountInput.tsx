import { InputProps, InputGroupProps, InputGroup, InputLeftAddon, Input } from "@hope-ui/solid"
import { Component, splitProps } from "solid-js"

const AmountInput: Component<
  InputProps & {
    onLeftAddonClick?: (event: MouseEvent) => void
    containerProps?: InputGroupProps
    prefix?: string
  }
> = (allProps) => {
  const [props, inputProps] = splitProps(allProps, ["onLeftAddonClick", "containerProps", "prefix"])

  return (
    <InputGroup {...props.containerProps}>
      <InputLeftAddon paddingStart="$2" paddingEnd="$2" onClick={props.onLeftAddonClick}>
        {props.prefix}¥
      </InputLeftAddon>
      <Input {...inputProps} />
    </InputGroup>
  )
}

export default AmountInput
