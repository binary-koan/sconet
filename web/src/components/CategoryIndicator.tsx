import {
  IconCurrencyPound,
  IconEyeOff,
  IconQuestionMark,
  IconSeparatorHorizontal
} from "@tabler/icons-solidjs"
import { Component, mergeProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { ClassProps } from "../types.ts"
import { CATEGORY_BACKGROUND_COLORS, CategoryColor } from "../utils/categoryColors.ts"

export type CategoryIndicatorProps = ClassProps & {
  iconSize?: string
  color?: string
  icon?: Component<{ size?: string }>
  includeInReports?: boolean
  isSplit?: boolean
  isIncome?: boolean
}

const CategoryIndicator: Component<CategoryIndicatorProps> = (baseProps) => {
  const props = mergeProps({ includeInReports: true, isSplit: false, isIncome: false }, baseProps)

  const getBackgroundColor = () => {
    if (!props.includeInReports || props.isSplit) return "bg-gray-200"
    if (props.isIncome) return "bg-gray-200"
    if (!props.color) return "bg-gray-200"
    return CATEGORY_BACKGROUND_COLORS[props.color as CategoryColor] || "bg-gray-200"
  }

  const getColor = () => {
    if (!props.includeInReports) return "text-gray-300"
    if (props.isSplit) return "text-gray-300"
    if (props.isIncome) return "text-green-500"
    if (!props.color) return "text-red-500"
    return "text-white"
  }

  const getIcon = (): Component<{ size?: string }> => {
    if (props.isIncome) return IconCurrencyPound
    if (props.isSplit) return IconSeparatorHorizontal
    if (!props.includeInReports) return IconEyeOff
    if (!props.icon) return IconQuestionMark
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
