import { CATEGORY_BACKGROUND_COLORS, CategoryColor } from "@/lib/categoryColors"
import { cn } from "@/lib/utils"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Text, View } from "react-native"

type IconName = keyof typeof MaterialCommunityIcons.glyphMap

interface CategoryIndicatorProps {
  className?: string
  iconSize?: number
  color?: string
  emoji?: string | null
  includeInReports?: boolean
  isSplit?: boolean
  isIncome?: boolean
}

export function CategoryIndicator({
  className,
  iconSize = 16,
  color,
  emoji,
  includeInReports = true,
  isSplit = false,
  isIncome = false
}: CategoryIndicatorProps) {
  const getBackgroundColor = () => {
    if (!includeInReports || isSplit) return "bg-gray-200"
    if (isIncome) return "bg-gray-200"
    if (!color) return "bg-gray-200"
    return CATEGORY_BACKGROUND_COLORS[color as CategoryColor] || "bg-gray-200"
  }

  const getIconColor = () => {
    if (!includeInReports) return "#d1d5db" // gray-300
    if (isSplit) return "#d1d5db" // gray-300
    if (isIncome) return "#22c55e" // green-500
    return "#ffffff" // white
  }

  const getSpecialIcon = (): IconName | null => {
    if (isIncome) return "currency-gbp"
    if (isSplit) return "arrow-split-horizontal"
    if (!includeInReports) return "eye-off"
    return null
  }

  const specialIcon = getSpecialIcon()

  return (
    <View
      className={cn("items-center justify-center rounded-full", getBackgroundColor(), className)}
    >
      {specialIcon ? (
        <MaterialCommunityIcons name={specialIcon} size={iconSize} color={getIconColor()} />
      ) : (
        <Text style={{ fontSize: iconSize }}>{emoji || "❓"}</Text>
      )}
    </View>
  )
}
