import { Box, HopeProps, Icon } from "@hope-ui/solid"
import { TbBox, TbCurrencyPound, TbMinus, TbSeparator } from "solid-icons/tb"
import { Component } from "solid-js"

const CategoryIndicator = ({
  size,
  iconSize,
  color,
  icon,
  includeInReports = true,
  isSplit = false,
  isIncome = false,
  ...props
}: HopeProps & {
  size: string
  iconSize?: string
  color?: string
  icon?: Component<{ size?: string }>
  includeInReports?: boolean
  isSplit?: boolean
  isIncome?: boolean
}) => {
  const getBackgroundColor = () => {
    if (!includeInReports || isSplit) return "$neutral2"
    if (isIncome) return "$neutral2"
    if (!color) return "$neutral2"
    return `$${color}8`
  }

  const getColor = () => {
    if (!includeInReports || isSplit) return "$neutral2"
    if (isIncome) return "$green8"
    if (!color) return "$red8"
    return "white"
  }

  const getIcon = (): Component<{ size?: string }> => {
    if (isIncome) return TbCurrencyPound
    if (isSplit) return TbSeparator
    if (!includeInReports) return TbMinus
    if (!icon) return TbBox
    return icon
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor={getBackgroundColor()}
      borderRadius="full"
      height={size}
      width={size}
      minHeight={size}
      minWidth={size}
      color={getColor()}
      {...props}
    >
      <Icon size={iconSize} as={getIcon()} />
    </Box>
  )
}

export default CategoryIndicator
