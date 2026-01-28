import { Pressable, View } from "react-native"
import { useRouter } from "expo-router"
import { Text } from "@/components/ui/text"
import { CategoryIndicator } from "@/components/CategoryIndicator"
import { Transaction } from "@/lib/graphql/types"
import { cn } from "@/lib/utils"

interface GroupedSplit {
  category?: {
    id: string
    name: string
    icon?: string
    color?: string
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
    transaction.includeInReports ||
    transaction.splitTo?.some((child) => child.includeInReports)

  const navigateToTransaction = () => {
    router.push(`/transactions/${transaction.id}`)
  }

  // Group split transactions by category
  const splitTo: GroupedSplit[] = transaction.splitTo
    ? Object.values(
        transaction.splitTo.reduce(
          (acc, child) => {
            const categoryId = child.category?.id || "uncategorized"
            if (!acc[categoryId]) {
              acc[categoryId] = {
                category: child.category,
                count: 0,
                memos: [],
              }
            }
            acc[categoryId].count++
            if (child.memo) {
              acc[categoryId].memos.push(child.memo)
            }
            return acc
          },
          {} as Record<
            string,
            { category?: GroupedSplit["category"]; count: number; memos: string[] }
          >
        )
      ).map((group) => ({
        category: group.category,
        count: group.count,
        memos:
          group.memos.slice(0, 5).join(", ") +
          (group.memos.length > 5 ? " ..." : ""),
      }))
    : []

  const isIncome = transaction.amount && transaction.amount.amountDecimal > 0

  return (
    <>
      <Pressable
        onPress={navigateToTransaction}
        className={cn(
          "flex-row items-center bg-background py-3 pr-4",
          parent ? "pl-10" : "pl-4"
        )}
      >
        <CategoryIndicator
          className="h-8 w-8"
          iconSize={18}
          icon={transaction.category?.icon}
          color={transaction.category?.color}
          includeInReports={includeInReports}
          isIncome={isIncome}
          isSplit={!!parent}
        />

        <View className="ml-3 min-w-0 flex-1">
          <Text
            className={cn(
              "text-sm",
              !includeInReports && "text-muted line-through"
            )}
            numberOfLines={1}
          >
            {transaction.shop}
            {transaction.memo && (
              <Text className="text-muted"> – {transaction.memo}</Text>
            )}
          </Text>
        </View>

        <View className="ml-2 items-end">
          <Text
            className={cn(
              "text-sm",
              !includeInReports && "text-muted line-through"
            )}
          >
            {transaction.amount?.formatted ?? "Pending"}
          </Text>
          {transaction.shopAmount && (
            <Text className="text-xs text-muted">
              {transaction.shopAmount.formatted}
            </Text>
          )}
        </View>
      </Pressable>

      {/* Render grouped split transactions */}
      {splitTo.map((child, index) => (
        <Pressable
          key={`${child.category?.id || "uncategorized"}-${index}`}
          onPress={navigateToTransaction}
          className="flex-row items-center bg-background py-2 pl-10 pr-4"
        >
          <CategoryIndicator
            className="mr-3 h-6 w-6"
            iconSize={14}
            icon={child.category?.icon}
            color={child.category?.color}
            includeInReports={transaction.includeInReports}
            isIncome={isIncome}
          />

          <Text className="min-w-0 flex-1 text-sm text-muted" numberOfLines={1}>
            {child.memos || child.category?.name || "Uncategorized"}
          </Text>

          <View className="ml-2 h-6 w-6 items-center justify-center rounded-full bg-gray-200">
            <Text className="text-xs">{child.count}</Text>
          </View>
        </Pressable>
      ))}
    </>
  )
}
