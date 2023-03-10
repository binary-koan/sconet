import { TbCurrencyPound, TbMinus, TbQuestionMark, TbSeparator } from "solid-icons/tb"
import { Component, mergeProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { ClassProps } from "../types"
import { CategoryColor, CATEGORY_BACKGROUND_COLORS } from "../utils/categoryColors"

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
    if (!props.icon) return TbQuestionMark
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
