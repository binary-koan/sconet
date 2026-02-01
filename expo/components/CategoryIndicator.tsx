import { CATEGORY_BACKGROUND_COLORS, CategoryColor } from "@/lib/categoryColors"
import { cn } from "@/lib/utils"
import { Text, View } from "react-native"

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
    if (!includeInReports || isSplit) return "bg-muted"
    if (isIncome) return "bg-muted"
    if (!color) return "bg-muted"
    return CATEGORY_BACKGROUND_COLORS[color as CategoryColor] || "bg-muted"
  }

  const getSpecialIcon = () => {
    if (isIncome) return "£"
    if (isSplit) return "⌄"
    if (!includeInReports) return "−"
    return null
  }

  return (
    <View
      className={cn("items-center justify-center rounded-full", getBackgroundColor(), className)}
    >
      <Text className="text-foreground" style={{ fontSize: iconSize, marginTop: isSplit ? -8 : 0 }}>
        {getSpecialIcon() || emoji || "?"}
      </Text>
    </View>
  )
}
