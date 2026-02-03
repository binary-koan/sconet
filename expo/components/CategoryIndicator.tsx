import { CATEGORY_BACKGROUND_COLORS, CategoryColor } from "@/lib/categoryColors"
import { cn } from "@/lib/utils"
import {
  IconCoinPound,
  IconEyeOff,
  IconQuestionMark,
  IconSeparatorHorizontal
} from "@tabler/icons-react-native"
import { View } from "react-native"
import { namedIcons } from "./namedIcons"

interface CategoryIndicatorProps {
  className?: string
  iconSize?: number
  color?: string
  icon?: string | null
  includeInReports?: boolean
  isSplit?: boolean
  isIncome?: boolean
}

export function CategoryIndicator({
  className,
  iconSize = 16,
  color,
  icon,
  includeInReports = true,
  isSplit = false,
  isIncome = false
}: CategoryIndicatorProps) {
  const getBackgroundColor = () => {
    if (!includeInReports || isSplit) return "bg-muted"
    if (isIncome) return "bg-muted"
    if (!color) return "bg-muted"
    return CATEGORY_BACKGROUND_COLORS[color as CategoryColor] || "bg-muted"
  }

  const getSpecialIcon = () => {
    if (isIncome) return IconCoinPound
    if (isSplit) return IconSeparatorHorizontal
    if (!includeInReports) return IconEyeOff
    return null
  }

  const Icon = getSpecialIcon() ?? namedIcons[icon ?? ""] ?? IconQuestionMark

  return (
    <View
      className={cn("items-center justify-center rounded-full", getBackgroundColor(), className)}
    >
      <Icon size={iconSize} color="white" />
    </View>
  )
}
