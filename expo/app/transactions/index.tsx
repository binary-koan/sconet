import { MonthPickerModal } from "@/components/transactions/MonthPickerModal"
import { NewTransactionForm } from "@/components/transactions/NewTransactionForm"
import { TransactionsList } from "@/components/transactions/TransactionsList"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { formatDate } from "@/lib/formatters"
import { useTransactionsQuery } from "@/lib/graphql/queries"
import { Stack } from "expo-router"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react-native"
import { useMemo, useState } from "react"
import { ActivityIndicator, TouchableOpacity, View } from "react-native"

function getMonthRange(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const dateFrom = firstDay.toISOString().split("T")[0]
  const dateUntil = lastDay.toISOString().split("T")[0]

  return { dateFrom, dateUntil }
}

export default function TransactionsScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(() => new Date())

  const { dateFrom, dateUntil } = useMemo(() => getMonthRange(currentMonth), [currentMonth])

  const { data, loading, error, refetch } = useTransactionsQuery({
    limit: 1000,
    filter: { dateFrom, dateUntil }
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const isCurrentMonth =
    currentMonth.getMonth() === new Date().getMonth() &&
    currentMonth.getFullYear() === new Date().getFullYear()

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <TouchableOpacity
              onPress={() => setShowMonthPicker(true)}
              className="flex-row items-center gap-1"
            >
              <Text className="text-base font-semibold">
                {formatDate(currentMonth, "monthYear")}
              </Text>
              <Icon as={ChevronDownIcon} className="size-4" />
            </TouchableOpacity>
          )
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
            month={currentMonth}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        ) : null}

        <View className="absolute bottom-8 left-6 flex-row items-center gap-3">
          <TouchableOpacity
            onPress={goToPreviousMonth}
            className="bg-muted size-10 items-center justify-center rounded-full shadow-lg"
          >
            <Icon as={ChevronLeftIcon} className="size-5" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goToNextMonth}
            disabled={isCurrentMonth}
            className={`size-10 items-center justify-center rounded-full shadow-lg ${
              isCurrentMonth ? "bg-muted/50" : "bg-muted"
            }`}
          >
            <Icon
              as={ChevronRightIcon}
              className={`size-5 ${isCurrentMonth ? "text-muted-foreground" : ""}`}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setShowNewTransactionForm(true)}
          className="bg-accent absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full shadow-lg"
        >
          <Icon as={PlusIcon} className="size-6" />
        </TouchableOpacity>

        <NewTransactionForm
          open={showNewTransactionForm}
          onOpenChange={setShowNewTransactionForm}
        />

        <MonthPickerModal
          open={showMonthPicker}
          onClose={() => setShowMonthPicker(false)}
          initialDate={currentMonth}
          onSelect={setCurrentMonth}
        />
      </View>
    </>
  )
}
