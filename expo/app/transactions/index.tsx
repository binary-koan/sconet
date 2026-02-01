import { NewTransactionForm } from "@/components/transactions/NewTransactionForm"
import { TransactionsList } from "@/components/transactions/TransactionsList"
import { Text } from "@/components/ui/text"
import { useTransactionsQuery } from "@/lib/graphql/queries"
import { TransactionsQuery } from "@/lib/graphql/types"
import { Stack } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Pressable, View } from "react-native"

export default function TransactionsScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false)
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

        {/* Floating Action Button */}
        <Pressable
          onPress={() => setShowNewTransactionForm(true)}
          className="bg-accent absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full shadow-lg"
        >
          <Text className="text-accent-foreground text-2xl font-medium">+</Text>
        </Pressable>

        {/* New Transaction Form Sheet */}
        <NewTransactionForm
          open={showNewTransactionForm}
          onOpenChange={setShowNewTransactionForm}
        />
      </View>
    </>
  )
}
