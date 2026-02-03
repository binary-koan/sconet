import { Tabs } from "expo-router"
import { BarChart3, Receipt, Settings } from "lucide-react-native"
import { useCSSVariable } from "uniwind"

export default function TabLayout() {
  const [backgroundColor, borderColor, foregroundColor, mutedForeground] = useCSSVariable([
    "--color-background",
    "--color-border",
    "--color-foreground",
    "--color-muted-foreground"
  ])

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: backgroundColor as string },
        headerTintColor: foregroundColor as string,
        tabBarStyle: {
          backgroundColor: backgroundColor as string,
          borderColor: borderColor as string
        },
        tabBarActiveTintColor: foregroundColor as string,
        tabBarInactiveTintColor: mutedForeground as string
      }}
    >
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Receipt size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="graphs"
        options={{
          title: "Graphs",
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />
        }}
      />
    </Tabs>
  )
}
