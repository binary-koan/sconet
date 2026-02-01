import { AccountPicker } from "@/components/AccountPicker"
import { CategoryIndicator } from "@/components/CategoryIndicator"
import { CategoryPicker } from "@/components/CategoryPicker"
import { DatePicker } from "@/components/DatePicker"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { useTransactionUpdateMutation } from "@/lib/graphql/mutations"
import {
  TRANSACTION_QUERY,
  TRANSACTIONS_QUERY,
  useAccountsQuery,
  useCategoriesQuery,
  useTransactionQuery
} from "@/lib/graphql/queries"
import { Category } from "@/lib/graphql/types"
import { cn } from "@/lib/utils"
import { Stack, useLocalSearchParams } from "expo-router"
import { EyeIcon, EyeOffIcon } from "lucide-react-native"
import { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native"

type Account = {
  id: string
  name: string
  currency: {
    id: string
    code: string
    symbol: string
  }
}

function formatDateForApi(date: Date): string {
  return date.toISOString().split("T")[0]
}

function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { data, loading, error } = useTransactionQuery({ id })
  const { data: categoriesData } = useCategoriesQuery()
  const { data: accountsData } = useAccountsQuery()
  const [updateTransaction, { loading: updating }] = useTransactionUpdateMutation()

  const categories = useMemo(() => categoriesData?.categories ?? [], [categoriesData?.categories])
  const accounts = useMemo(() => accountsData?.accounts ?? [], [accountsData?.accounts])

  const transaction = data?.transaction

  const [shop, setShop] = useState("")
  const [memo, setMemo] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [includeInReports, setIncludeInReports] = useState(true)

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (transaction) {
      setShop(transaction.shop)
      setMemo(transaction.memo ?? "")
      setSelectedCategory(transaction.category ?? null)
      setSelectedDate(parseDate(transaction.date))
      setIncludeInReports(transaction.includeInReports)

      const matchingAccount = accounts.find((a) => a.id === transaction.account.id)
      if (matchingAccount) {
        setSelectedAccount(matchingAccount)
      }

      setHasChanges(false)
    }
  }, [transaction, accounts])

  const handleFieldChange = <T,>(setter: (value: T) => void) => {
    return (value: T) => {
      setter(value)
      setHasChanges(true)
    }
  }

  const handleSave = async () => {
    if (!transaction || !shop.trim()) return

    try {
      await updateTransaction({
        variables: {
          id: transaction.id,
          transactionInput: {
            shop: shop.trim(),
            memo: memo.trim() || undefined,
            categoryId: selectedCategory?.id,
            accountId: selectedAccount?.id,
            date: formatDateForApi(selectedDate),
            includeInReports
          }
        },
        refetchQueries: [
          { query: TRANSACTION_QUERY, variables: { id } },
          { query: TRANSACTIONS_QUERY, variables: { limit: 50 } }
        ]
      })

      setHasChanges(false)
    } catch (error) {
      console.error("Failed to update transaction:", error)
    }
  }

  const toggleIncludeInReports = async () => {
    if (!transaction) return

    const newValue = !includeInReports
    setIncludeInReports(newValue)

    try {
      await updateTransaction({
        variables: {
          id: transaction.id,
          transactionInput: { includeInReports: newValue }
        },
        refetchQueries: [
          { query: TRANSACTION_QUERY, variables: { id } },
          { query: TRANSACTIONS_QUERY, variables: { limit: 50 } }
        ]
      })
    } catch (error) {
      console.error("Failed to toggle includeInReports:", error)
      setIncludeInReports(!newValue)
    }
  }

  const isIncome = transaction?.amount && transaction.amount.amountDecimal > 0
  const hasSplits = transaction?.splitTo && transaction.splitTo.length > 0

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Transaction" }} />
        <View className="bg-body-bg flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </>
    )
  }

  if (error || !transaction) {
    return (
      <>
        <Stack.Screen options={{ title: "Transaction" }} />
        <View className="bg-body-bg flex-1 items-center justify-center px-4">
          <Text className="text-destructive text-center">
            {error?.message ?? "Transaction not found"}
          </Text>
        </View>
      </>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Transaction",
          headerRight: () => (
            <Pressable onPress={toggleIncludeInReports} className="p-2">
              <Icon
                as={includeInReports ? EyeIcon : EyeOffIcon}
                className="size-6 text-foreground"
              />
            </Pressable>
          )
        }}
      />
      <ScrollView className="bg-body-bg flex-1">
        <View className="gap-4 p-4">
          <View className="gap-2">
            <Text variant="small" className="text-muted-foreground">
              Where?
            </Text>
            <Input value={shop} onChangeText={handleFieldChange(setShop)} />
          </View>

          <View className="gap-2">
            <Text variant="small" className="text-muted-foreground">
              What?
            </Text>
            <Input value={memo} onChangeText={handleFieldChange(setMemo)} placeholder="Optional" />
          </View>

          <View className="gap-2">
            <Text variant="small" className="text-muted-foreground">
              Amount
            </Text>
            <View className="border-input bg-muted/50 flex h-10 flex-row items-center justify-between rounded-md border px-3">
              <Text className={cn(!includeInReports && "text-muted-foreground line-through")}>
                {transaction.amount?.formatted ?? "Pending"}
              </Text>
              {transaction.shopAmount && (
                <Text className="text-muted-foreground text-sm">
                  {transaction.shopAmount.formatted}
                </Text>
              )}
            </View>
          </View>

          {!isIncome && !hasSplits && (
            <View className="gap-2">
              <Text variant="small" className="text-muted-foreground">
                Category
              </Text>
              <CategoryPicker
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={handleFieldChange(setSelectedCategory)}
              />
            </View>
          )}

          {isIncome && (
            <View className="gap-2">
              <Text variant="small" className="text-muted-foreground">
                Type
              </Text>
              <View className="border-input bg-muted/50 flex h-10 flex-row items-center gap-3 rounded-md border px-3">
                <CategoryIndicator
                  className="h-7 w-7"
                  iconSize={14}
                  isIncome={true}
                  includeInReports={includeInReports}
                />
                <Text>Income</Text>
              </View>
            </View>
          )}

          <View className="gap-2">
            <Text variant="small" className="text-muted-foreground">
              Date
            </Text>
            <DatePicker
              value={selectedDate}
              onChange={handleFieldChange(setSelectedDate)}
              maxDate={new Date()}
            />
          </View>

          <View className="gap-2">
            <Text variant="small" className="text-muted-foreground">
              Account
            </Text>
            <AccountPicker
              accounts={accounts}
              selectedAccount={selectedAccount}
              onSelect={handleFieldChange(setSelectedAccount)}
            />
          </View>

          {hasSplits && (
            <View className="gap-2">
              <Text variant="small" className="text-muted-foreground">
                Split Items
              </Text>
              <View className="border-border rounded-lg border">
                {transaction.splitTo!.map((split, index) => (
                  <View
                    key={split.id}
                    className={cn(
                      "flex-row items-center gap-3 p-3",
                      index < transaction.splitTo!.length - 1 && "border-border border-b"
                    )}
                  >
                    <CategoryIndicator
                      className="h-8 w-8"
                      iconSize={16}
                      color={split.category?.color}
                      emoji={split.category?.emoji}
                      includeInReports={split.includeInReports}
                    />
                    <View className="min-w-0 flex-1">
                      <Text numberOfLines={1}>{split.memo || split.category?.name || "Item"}</Text>
                    </View>
                    <Text className="text-muted-foreground">
                      {split.amount?.formatted ?? "Pending"}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {hasChanges && (
            <View className="pt-4">
              <Button onPress={handleSave} disabled={updating || !shop.trim()}>
                {updating ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text>Save Changes</Text>
                )}
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  )
}
