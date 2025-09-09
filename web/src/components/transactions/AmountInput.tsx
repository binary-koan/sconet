import { Component, splitProps } from "solid-js"
import { InputProps } from "../base/Input.tsx"
import { InputAddon, InputGroup, InputGroupInput, InputGroupProps } from "../base/InputGroup.tsx"

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
      <InputAddon class="w-10" onClick={props.onLeftAddonClick}>
        {props.prefix}¥
      </InputAddon>
      <InputGroupInput {...inputProps} />
    </InputGroup>
  )
}

export default AmountInput
