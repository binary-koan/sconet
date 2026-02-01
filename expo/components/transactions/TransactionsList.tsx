import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import { formatDate, stripTime } from "@/lib/formatters"
import { Transaction, TransactionsQuery } from "@/lib/graphql/types"
import { useMemo } from "react"
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native"
import { TransactionItem } from "./TransactionItem"

interface TransactionsListProps {
  data: TransactionsQuery
  month: Date
  onRefresh?: () => void
  isRefreshing?: boolean
  onDatePress?: (date: Date) => void
}

interface DateGroup {
  date: Date
  dateString: string
  transactions: Transaction[]
}

export function TransactionsList({
  data,
  month,
  onRefresh,
  isRefreshing = false,
  onDatePress
}: TransactionsListProps) {
  const groupedItems = useMemo(() => {
    const transactions = data.transactions.nodes
    const year = month.getFullYear()
    const monthIndex = month.getMonth()

    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)

    const today = new Date()
    const endDate =
      year === today.getFullYear() && monthIndex === today.getMonth() ? today : lastDay

    const items: DateGroup[] = []

    for (let date = new Date(endDate); date >= firstDay; date.setDate(date.getDate() - 1)) {
      const dateString = stripTime(date)
      const transactionsOnDate = transactions.filter(
        (transaction) => transaction.date === dateString
      )

      items.push({
        date: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
        dateString,
        transactions: transactionsOnDate
      })
    }

    return items
  }, [data, month])

  const renderDateGroup = ({ item }: { item: DateGroup }) => {
    return (
      <View>
        <TouchableOpacity
          className="px-4 pb-2 pt-4"
          onPress={() => onDatePress?.(item.date)}
          activeOpacity={onDatePress ? 0.7 : 1}
        >
          <Text className="text-muted-foreground text-sm">
            {formatDate(item.date, "fullDateWithoutYear")}
          </Text>
        </TouchableOpacity>

        {item.transactions.length > 0 ? (
          <View className="overflow-hidden">
            {item.transactions.map((transaction, idx) => (
              <View key={transaction.id}>
                {idx > 0 && <Separator />}
                <TransactionItem transaction={transaction} />
              </View>
            ))}
          </View>
        ) : (
          <View className="px-4">
            <Text className="text-muted-foreground text-sm italic">-</Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <FlatList
      data={groupedItems}
      renderItem={renderDateGroup}
      keyExtractor={(item) => item.dateString}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} /> : undefined
      }
    />
  )
}
