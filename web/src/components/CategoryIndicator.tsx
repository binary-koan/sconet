import { Box, HopeProps, Icon } from "@hope-ui/solid"
import { TbBox, TbCurrencyPound, TbMinus, TbSeparator } from "solid-icons/tb"
import { Component, mergeProps, splitProps } from "solid-js"

const CategoryIndicator: Component<
  HopeProps & {
    size: string
    iconSize?: string
    color?: string
    icon?: Component<{ size?: string }>
    includeInReports?: boolean
    isSplit?: boolean
    isIncome?: boolean
  }
> = (allProps) => {
  let [props, boxProps] = splitProps(allProps, [
    "size",
    "iconSize",
    "color",
    "icon",
    "includeInReports",
    "isSplit",
    "isIncome"
  ])

  props = mergeProps({ includeInReports: true, isSplit: false, isIncome: false }, props)

  const getBackgroundColor = () => {
    if (!props.includeInReports || props.isSplit) return "$neutral2"
    if (props.isIncome) return "$neutral2"
    if (!props.color) return "$neutral2"
    return `$${props.color}8`
  }

  const getColor = () => {
    if (!props.includeInReports || props.isSplit) return "$neutral2"
    if (props.isIncome) return "$green8"
    if (!props.color) return "$red8"
    return "white"
  }

  const getIcon = (): Component<{ size?: string }> => {
    if (props.isIncome) return TbCurrencyPound
    if (props.isSplit) return TbSeparator
    if (!props.includeInReports) return TbMinus
    if (!props.icon) return TbBox
    return props.icon
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor={getBackgroundColor()}
      borderRadius="$full"
      height={props.size}
      width={props.size}
      minHeight={props.size}
      minWidth={props.size}
      color={getColor()}
      {...boxProps}
    >
      <Icon size={props.iconSize} as={getIcon()} />
    </Box>
  )
}

export default CategoryIndicator
