import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { useAuth } from "@/lib/AuthProvider"
import { View } from "react-native"

export default function SettingsScreen() {
  const { signOut } = useAuth()

  return (
    <View className="bg-background flex-1 p-4">
      <Button variant="destructive" onPress={signOut}>
        <Text>Log Out</Text>
      </Button>
    </View>
  )
}
