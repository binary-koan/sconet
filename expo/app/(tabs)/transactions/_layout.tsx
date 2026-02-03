import { Stack } from "expo-router"
import { useCSSVariable } from "uniwind"

export default function TransactionsLayout() {
  const [backgroundColor, foregroundColor] = useCSSVariable([
    "--color-background",
    "--color-foreground"
  ])

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: backgroundColor as string },
        headerTintColor: foregroundColor as string
      }}
    />
  )
}
