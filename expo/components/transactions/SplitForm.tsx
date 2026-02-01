import { CategoryPicker } from "@/components/CategoryPicker"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { Category } from "@/lib/graphql/types"
import { MinusIcon } from "lucide-react-native"
import { useRef } from "react"
import { TextInput, TouchableOpacity, View } from "react-native"
import { Icon } from "../ui/icon"

export interface SplitItem {
  amount: string
  memo: string
  numericAmount: number
}

export interface SplitGroup {
  category: Category | null
  items: SplitItem[]
}

interface SplitFormProps {
  groups: SplitGroup[]
  onGroupsChange: (groups: SplitGroup[]) => void
  remainder: number
  categories: Category[]
}

export function parseNumericAmount(amount: string): number {
  const cleaned = amount.replace(/[^0-9.-]/g, "")
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export function SplitForm({ groups, onGroupsChange, remainder, categories }: SplitFormProps) {
  const memoInputRefs = useRef<Map<string, TextInput | null>>(new Map())

  const updateItem = (
    groupIndex: number,
    itemIndex: number,
    field: "amount" | "memo",
    value: string
  ) => {
    const newGroups = groups.map((group, gi) => {
      if (gi !== groupIndex) return group

      const newItems = group.items.map((item, ii) => {
        if (ii !== itemIndex) return item
        return {
          ...item,
          [field]: value,
          numericAmount: field === "amount" ? parseNumericAmount(value) : item.numericAmount
        }
      })

      // Auto-add new row within the same group if last item has both memo and amount
      const lastItem = newItems[newItems.length - 1]
      if (lastItem.memo && lastItem.amount) {
        newItems.push({ amount: "", memo: "", numericAmount: 0 })
      }

      return { ...group, items: newItems }
    })

    onGroupsChange(newGroups)
  }

  const updateCategory = (groupIndex: number, category: Category | null) => {
    const newGroups = groups.map((group, gi) => {
      if (gi !== groupIndex) return group
      return { ...group, category }
    })

    if (newGroups.every((g) => g.category !== null)) {
      newGroups.push({
        category: null,
        items: [{ amount: "", memo: "", numericAmount: 0 }]
      })
    }

    onGroupsChange(newGroups)

    // Auto-focus the first memo input in this group after selecting a category
    setTimeout(() => {
      const ref = memoInputRefs.current.get(`${groupIndex}-0`)
      ref?.focus()
    }, 100)
  }

  const removeGroup = (groupIndex: number) => {
    if (groups.length <= 1) return
    const newGroups = groups.filter((_, i) => i !== groupIndex)
    onGroupsChange(newGroups)
  }

  return (
    <View className="gap-4">
      {groups.map((group, groupIndex) => (
        <View key={groupIndex} className="gap-2">
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <CategoryPicker
                categories={categories}
                selectedCategory={group.category}
                onSelect={(cat) => updateCategory(groupIndex, cat)}
              />
            </View>
            {groups.length > 1 && (
              <TouchableOpacity
                onPress={() => removeGroup(groupIndex)}
                className="h-10 w-10 items-center justify-center"
              >
                <Icon as={MinusIcon} className="size-5 text-muted-foreground" />
              </TouchableOpacity>
            )}
          </View>
          {group.items.map((item, itemIndex) => (
            <View key={itemIndex} className="flex-row gap-2">
              <View className="flex-3">
                <Input
                  ref={(ref) => {
                    memoInputRefs.current.set(`${groupIndex}-${itemIndex}`, ref)
                  }}
                  value={item.memo}
                  onChangeText={(value) => updateItem(groupIndex, itemIndex, "memo", value)}
                  placeholder="Memo"
                />
              </View>
              <View className="flex-2">
                <Input
                  value={item.amount}
                  onChangeText={(value) => updateItem(groupIndex, itemIndex, "amount", value)}
                  placeholder="Amount"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          ))}
        </View>
      ))}
      <Text className="text-muted-foreground text-sm">Remainder: {remainder.toFixed(2)}</Text>
    </View>
  )
}

export function createInitialGroups(category: Category | null = null): SplitGroup[] {
  return [
    {
      category,
      items: [{ amount: "", memo: "", numericAmount: 0 }]
    }
  ]
}

export function getSplitsForSubmission(
  groups: SplitGroup[],
  remainder: number,
  defaultCategoryId: string | null,
  isExpense: boolean,
  decimalDigits: number = 2
): { memo: string; categoryId: string | null; amountCents: number }[] {
  const validSplits = groups.flatMap((group) =>
    group.items
      .filter((item) => item.memo && item.amount)
      .map((item) => ({
        memo: item.memo,
        categoryId: group.category?.id || defaultCategoryId,
        amountCents: Math.round(item.numericAmount * 10 ** decimalDigits) * (isExpense ? -1 : 1)
      }))
  )

  if (remainder > 0) {
    validSplits.push({
      memo: "",
      categoryId: defaultCategoryId,
      amountCents: Math.round(remainder * 10 ** decimalDigits) * (isExpense ? -1 : 1)
    })
  }

  return validSplits
}
