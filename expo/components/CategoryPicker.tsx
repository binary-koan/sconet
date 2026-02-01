import { CategoryIndicator } from "@/components/CategoryIndicator"
import { PickerModal } from "@/components/ui/picker-modal"
import { Text } from "@/components/ui/text"
import { Category } from "@/lib/graphql/types"
import { cn } from "@/lib/utils"
import { EllipsisIcon } from "lucide-react-native"
import { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { Icon } from "./ui/icon"

interface CategoryPickerProps {
  categories: Category[]
  selectedCategory?: Category | null
  onSelect: (category: Category | null) => void
  className?: string
}

export function CategoryPicker({
  categories,
  selectedCategory,
  onSelect,
  className
}: CategoryPickerProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (category: Category | null) => {
    onSelect(category)
    setOpen(false)
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className={cn("flex-row items-center gap-2", className)}
      >
        <View className="border-input bg-background flex h-10 flex-1 flex-row items-center gap-3 rounded-md border px-3 shadow-sm shadow-black/5">
          {selectedCategory ? (
            <>
              <CategoryIndicator
                className="h-7 w-7"
                iconSize={14}
                color={selectedCategory.color}
                emoji={selectedCategory.emoji}
              />
              <Text className="flex-1">{selectedCategory.name}</Text>
            </>
          ) : (
            <Text className="text-muted-foreground flex-1">No category</Text>
          )}
          <Icon as={EllipsisIcon} className="size-5 text-muted-foreground" />
        </View>
      </TouchableOpacity>

      <PickerModal open={open} onClose={() => setOpen(false)} title="Select Category">
        <View className="flex-row flex-wrap gap-3">
          {/* Uncategorized option */}
          <TouchableOpacity
            onPress={() => handleSelect(null)}
            className={cn(
              "items-center justify-center rounded-xl p-3",
              !selectedCategory && "bg-accent/20"
            )}
            style={{ width: "30%", aspectRatio: 1 }}
          >
            <View className="bg-muted mb-2 h-12 w-12 items-center justify-center rounded-full">
              <Text style={{ fontSize: 20 }}>?</Text>
            </View>
            <Text className="text-center text-xs" numberOfLines={1}>
              None
            </Text>
          </TouchableOpacity>

          {/* Category options */}
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleSelect(category)}
              className={cn(
                "items-center justify-center rounded-xl p-3",
                selectedCategory?.id === category.id && "bg-accent/20"
              )}
              style={{ width: "30%", aspectRatio: 1 }}
            >
              <CategoryIndicator
                className="mb-2 h-12 w-12"
                iconSize={20}
                color={category.color}
                emoji={category.emoji}
              />
              <Text className="text-center text-xs" numberOfLines={1}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </PickerModal>
    </>
  )
}
