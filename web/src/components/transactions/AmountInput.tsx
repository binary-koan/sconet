import { InputProps, InputGroupProps, InputGroup, InputLeftAddon, Input } from "@hope-ui/solid"

const AmountInput = ({
  containerProps = {},
  prefix = "",
  onLeftAddonClick = undefined,
  ...props
}: InputProps & {
  onLeftAddonClick?: (event: MouseEvent) => void
  containerProps?: InputGroupProps
  prefix?: string
}) => {
  return (
    <InputGroup {...containerProps}>
      <InputLeftAddon paddingStart="$2" paddingEnd="$2" onClick={onLeftAddonClick}>
        {prefix}¥
      </InputLeftAddon>
      <Input {...props} />
    </InputGroup>
  )
}

export default AmountInput
