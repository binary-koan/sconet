import { TbBox, TbCurrencyPound, TbMinus, TbSeparator } from "solid-icons/tb"
import { Component, mergeProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { ClassProps } from "../types"

export const CATEGORY_BACKGROUND_COLORS = {
  gray: "bg-gray-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  teal: "bg-teal-500",
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  purple: "bg-violet-500",
  pink: "bg-pink-500"
}

export const CATEGORY_COLORS = Object.keys(CATEGORY_BACKGROUND_COLORS)
export type CategoryColor = keyof typeof CATEGORY_BACKGROUND_COLORS

const CategoryIndicator: Component<
  ClassProps & {
    iconSize?: string
    color?: string
    icon?: Component<{ size?: string }>
    includeInReports?: boolean
    isSplit?: boolean
    isIncome?: boolean
  }
> = (props) => {
  props = mergeProps({ includeInReports: true, isSplit: false, isIncome: false }, props)

  const getBackgroundColor = () => {
    if (!props.includeInReports || props.isSplit) return "bg-gray-200"
    if (props.isIncome) return "bg-gray-200"
    if (!props.color) return "bg-gray-200"
    return CATEGORY_BACKGROUND_COLORS[props.color as CategoryColor] || "bg-gray-200"
  }

  const getColor = () => {
    if (!props.includeInReports || props.isSplit) return "text-gray-200"
    if (props.isIncome) return "text-green-500"
    if (!props.color) return "text-red-500"
    return "text-white"
  }

  const getIcon = (): Component<{ size?: string }> => {
    if (props.isIncome) return TbCurrencyPound
    if (props.isSplit) return TbSeparator
    if (!props.includeInReports) return TbMinus
    if (!props.icon) return TbBox
    return props.icon
  }

  return (
    <div
      class={`flex items-center justify-center rounded-full ${props.class}`}
      classList={{ [getBackgroundColor()]: true, [getColor()]: true }}
    >
      <Dynamic component={getIcon()} size={props.iconSize} />
    </div>
  )
}

export default CategoryIndicator
