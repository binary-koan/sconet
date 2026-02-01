import { CategoryIndicator } from "@/components/CategoryIndicator"
import { Text } from "@/components/ui/text"
import { Transaction } from "@/lib/graphql/types"
import { cn } from "@/lib/utils"
import { useRouter } from "expo-router"
import { TouchableOpacity, View } from "react-native"

interface GroupedSplit {
  category?: {
    id: string
    name: string
    color?: string
    emoji?: string | null
  }
  count: number
  memos: string
}

interface TransactionItemProps {
  transaction: Transaction
  parent?: Transaction
}

export function TransactionItem({ transaction, parent }: TransactionItemProps) {
  const router = useRouter()

  const includeInReports =
    transaction.includeInReports || transaction.splitTo?.some((child) => child.includeInReports)

  const navigateToTransaction = () => {
    router.push(`/transactions/${transaction.id}`)
  }

  // Group split transactions by category
  const splitTo: GroupedSplit[] = transaction.splitTo
    ? Object.values(
        transaction.splitTo.reduce((acc, child) => {
          const categoryId = child.category?.id || "uncategorized"
          if (!acc[categoryId]) {
            acc[categoryId] = {
              category: child.category,
              count: 0,
              memos: []
            }
          }
          acc[categoryId].count++
          if (child.memo) {
            acc[categoryId].memos.push(child.memo)
          }
          return acc
        }, {} as Record<string, { category?: GroupedSplit["category"]; count: number; memos: string[] }>)
      ).map((group) => ({
        category: group.category,
        count: group.count,
        memos: group.memos.slice(0, 5).join(", ") + (group.memos.length > 5 ? " ..." : "")
      }))
    : []

  const isIncome = transaction.amount && transaction.amount.amountDecimal > 0

  return (
    <>
      <TouchableOpacity
        onPress={navigateToTransaction}
        className={cn("bg-background flex-row items-center py-3 pr-4", parent ? "pl-10" : "pl-4")}
      >
        <CategoryIndicator
          className="h-8 w-8"
          iconSize={18}
          color={transaction.category?.color}
          emoji={transaction.category?.emoji}
          includeInReports={includeInReports}
          isIncome={isIncome}
          isSplit={!!transaction.splitTo?.length}
        />

        <View className="ml-3 min-w-0 flex-1">
          <Text
            className={cn("text-sm", !includeInReports && "text-muted-foreground line-through")}
            numberOfLines={1}
          >
            {transaction.shop}
            {transaction.memo && (
              <Text className="text-muted-foreground"> – {transaction.memo}</Text>
            )}
          </Text>
        </View>

        <View className="ml-2 items-end">
          <Text
            className={cn("text-sm", !includeInReports && "text-muted-foreground line-through")}
          >
            {transaction.amount?.formatted ?? "Pending"}
          </Text>
          {transaction.shopAmount && (
            <Text className="text-muted-foreground text-xs">
              {transaction.shopAmount.formatted}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {splitTo.map((child, index) => (
        <TouchableOpacity
          key={`${child.category?.id || "uncategorized"}-${index}`}
          onPress={navigateToTransaction}
          className="bg-background flex-row items-center py-2 pl-10 pr-4"
        >
          <CategoryIndicator
            className="mr-3 h-6 w-6"
            iconSize={14}
            color={child.category?.color}
            emoji={child.category?.emoji}
            includeInReports={transaction.includeInReports}
            isIncome={isIncome}
          />

          <Text className="text-muted-foreground min-w-0 flex-1 text-sm" numberOfLines={1}>
            {child.memos || child.category?.name || "Uncategorized"}
          </Text>

          <View className="bg-muted ml-2 h-6 w-6 items-center justify-center rounded-full">
            <Text className="text-xs">{child.count}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  )
}
