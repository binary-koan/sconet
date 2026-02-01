import { Text } from "@/components/ui/text"
import { Stack, useLocalSearchParams } from "expo-router"
import { View } from "react-native"

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <>
      <Stack.Screen
        options={{
          title: "Transaction"
        }}
      />
      <View className="bg-body-bg flex-1 items-center justify-center px-4">
        <Text className="text-muted-foreground text-center">
          Transaction detail view for ID: {id}
        </Text>
        <Text className="text-muted-foreground mt-2 text-center text-sm">(Coming soon)</Text>
      </View>
    </>
  )
}
