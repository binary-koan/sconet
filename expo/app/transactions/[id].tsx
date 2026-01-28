import { View } from "react-native"
import { Stack, useLocalSearchParams } from "expo-router"
import { Text } from "@/components/ui/text"

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <>
      <Stack.Screen
        options={{
          title: "Transaction",
        }}
      />
      <View className="flex-1 items-center justify-center bg-body-bg px-4">
        <Text className="text-center text-muted">
          Transaction detail view for ID: {id}
        </Text>
        <Text className="mt-2 text-center text-sm text-muted">
          (Coming soon)
        </Text>
      </View>
    </>
  )
}
