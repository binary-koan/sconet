import { Text } from "@/components/ui/text"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react-native"
import { TouchableOpacity, View } from "react-native"
import { Icon } from "./ui/icon"

export type AmountType = "expense" | "income"

interface AmountTypePickerProps {
  value: AmountType
  onChange: (value: AmountType) => void
}

export function AmountTypePicker({ value, onChange }: AmountTypePickerProps) {
  return (
    <TouchableOpacity onPress={() => onChange(value === "expense" ? "income" : "expense")}>
      <View className="border-border bg-background m-1.5 flex h-7 w-24 flex-row items-center justify-center gap-1.5 rounded-md border">
        <Icon
          as={value === "expense" ? TrendingDownIcon : TrendingUpIcon}
          className="size-4 text-muted-foreground"
        />
        <Text className="text-muted-foreground text-sm">
          {value === "expense" ? "Expense" : "Income"}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
