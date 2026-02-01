import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import { formatDate, stripTime } from "@/lib/formatters"
import { Transaction, TransactionsQuery } from "@/lib/graphql/types"
import { useMemo } from "react"
import { FlatList, Pressable, RefreshControl, View } from "react-native"
import { TransactionItem } from "./TransactionItem"

interface TransactionsListProps {
  data: TransactionsQuery
  isFiltering?: boolean
  onFetchMore?: () => void
  isLoadingMore?: boolean
  onRefresh?: () => void
  isRefreshing?: boolean
}

interface DateGroup {
  date: Date
  dateString: string
  transactions: Transaction[]
  isNewMonth: boolean
}

export function TransactionsList({
  data,
  isFiltering = false,
  onFetchMore,
  isLoadingMore,
  onRefresh,
  isRefreshing = false
}: TransactionsListProps) {
  const groupedItems = useMemo(() => {
    const transactions = data.transactions.nodes

    if (!transactions.length) return []

    const firstTransactionDate = new Date(transactions[0].date)
    const lastTransactionDate = new Date(transactions[transactions.length - 1].date)

    const items: DateGroup[] = []
    let prevMonthYear: string | null = null

    for (
      let date = new Date(firstTransactionDate);
      date >= lastTransactionDate;
      date.setDate(date.getDate() - 1)
    ) {
      const dateString = stripTime(date)
      const transactionsOnDate = transactions.filter(
        (transaction) => transaction.date === dateString
      )

      if (transactionsOnDate.length || !isFiltering) {
        const currentMonthYear = formatDate(date, "monthYear")
        const isNewMonth = currentMonthYear !== prevMonthYear
        prevMonthYear = currentMonthYear

        items.push({
          date: new Date(date),
          dateString,
          transactions: transactionsOnDate,
          isNewMonth
        })
      }
    }

    return items
  }, [data, isFiltering])

  const renderDateGroup = ({ item, index }: { item: DateGroup; index: number }) => {
    return (
      <View>
        {/* Month header */}
        {item.isNewMonth && (
          <View className={`bg-body-bg px-4 pb-2 pt-4 ${index === 0 ? "" : "mt-4"}`}>
            <View className="relative flex-row items-center">
              <Separator className="absolute left-0 right-0" />
              <View className="bg-body-bg pr-3">
                <Text className="text-foreground text-base font-semibold">
                  {formatDate(item.date, "monthYear")}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Date label */}
        <View className="bg-body-bg px-4 pb-2 pt-4">
          <Text className="text-muted-foreground text-sm">
            {formatDate(item.date, "fullDateWithoutYear")}
          </Text>
        </View>

        {/* Transactions for this date */}
        {item.transactions.length > 0 ? (
          <View className="overflow-hidden rounded-lg">
            {item.transactions.map((transaction, idx) => (
              <View key={transaction.id}>
                {idx > 0 && <Separator className="ml-4" />}
                <TransactionItem transaction={transaction} />
              </View>
            ))}
          </View>
        ) : (
          <View className="px-4 py-3">
            <Text className="text-muted-foreground text-sm italic">No transactions</Text>
          </View>
        )}
      </View>
    )
  }

  const renderFooter = () => {
    if (!data.transactions.pageInfo.endCursor) return null

    return (
      <View className="py-4">
        <Pressable
          onPress={onFetchMore}
          disabled={isLoadingMore}
          className="bg-background mx-4 items-center rounded-lg py-3"
        >
          <Text className="text-accent text-sm">{isLoadingMore ? "Loading..." : "Fetch more"}</Text>
        </Pressable>
      </View>
    )
  }

  const renderEmpty = () => (
    <View className="px-4 py-8">
      <Text className="text-muted-foreground text-center italic">No transactions found.</Text>
    </View>
  )

  return (
    <FlatList
      data={groupedItems}
      renderItem={renderDateGroup}
      keyExtractor={(item) => item.dateString}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} /> : undefined
      }
    />
  )
}
