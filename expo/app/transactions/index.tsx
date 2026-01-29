import { useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { Stack } from "expo-router"
import { Text } from "@/components/ui/text"
import { TransactionsList } from "@/components/transactions/TransactionsList"
import { useTransactionsQuery } from "@/lib/graphql/queries"
import { TransactionsQuery } from "@/lib/graphql/types"

export default function TransactionsScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { data, loading, error, fetchMore, refetch } = useTransactionsQuery({
    limit: 50
  })

  const handleFetchMore = () => {
    if (!data?.transactions.pageInfo.endCursor) return

    fetchMore({
      variables: {
        offset: data.transactions.pageInfo.endCursor
      },
      updateQuery: (
        prev: TransactionsQuery,
        { fetchMoreResult }: { fetchMoreResult?: TransactionsQuery }
      ) => {
        if (!fetchMoreResult) return prev
        return {
          transactions: {
            ...fetchMoreResult.transactions,
            nodes: [...prev.transactions.nodes, ...fetchMoreResult.transactions.nodes]
          }
        }
      }
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Transactions"
        }}
      />
      <View className="bg-body-bg flex-1">
        {loading && !data ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-destructive text-center">
              Error loading transactions: {error.message}
            </Text>
          </View>
        ) : data ? (
          <TransactionsList
            data={data}
            onFetchMore={handleFetchMore}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        ) : null}
      </View>
    </>
  )
}
