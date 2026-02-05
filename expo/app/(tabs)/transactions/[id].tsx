import { AccountPicker } from "@/components/AccountPicker"
import { CategoryIndicator } from "@/components/CategoryIndicator"
import { CategoryPicker } from "@/components/CategoryPicker"
import { DatePicker } from "@/components/DatePicker"
import { getSplitsForSubmission, SplitForm, SplitGroup } from "@/components/transactions/SplitForm"
import { Button } from "@/components/ui/button"
import { FormModal } from "@/components/ui/form-modal"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { useTransactionSplitMutation, useTransactionUpdateMutation } from "@/lib/graphql/mutations"
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
import { EyeIcon, EyeOffIcon, SplitIcon, XIcon } from "lucide-react-native"
import { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, TouchableOpacity, View } from "react-native"

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
  const [splitTransaction, { loading: splitting }] = useTransactionSplitMutation()

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
  const [splitModalOpen, setSplitModalOpen] = useState(false)
  const [splitGroups, setSplitGroups] = useState<SplitGroup[]>([])

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

  const splitRemainder = useMemo(() => {
    if (!transaction?.amount) return 0
    const total = Math.abs(transaction.amount.amountDecimal)
    const splitSum = splitGroups.reduce(
      (acc, group) => acc + group.items.reduce((sum, item) => sum + item.numericAmount, 0),
      0
    )
    return parseFloat((total - splitSum).toFixed(2))
  }, [transaction?.amount, splitGroups])

  const openSplitModal = () => {
    if (!transaction) return

    // Convert existing splits to SplitGroup format, grouped by category
    if (transaction.splitTo && transaction.splitTo.length > 0) {
      const groupsByCategory = new Map<string | null, SplitGroup>()

      for (const split of transaction.splitTo) {
        const categoryId = split.category?.id ?? null
        const existingGroup = groupsByCategory.get(categoryId)
        const amount = Math.abs(split.amount?.amountDecimal ?? 0)

        const item = {
          amount: amount.toString(),
          memo: split.memo ?? "",
          numericAmount: amount
        }

        if (existingGroup) {
          existingGroup.items.push(item)
        } else {
          const category = split.category
            ? categories.find((c) => c.id === split.category!.id) ?? null
            : null
          groupsByCategory.set(categoryId, {
            category,
            items: [item]
          })
        }
      }

      const groups = Array.from(groupsByCategory.values())
      // Add empty row to each group and an empty group at the end
      for (const group of groups) {
        group.items.push({ amount: "", memo: "", numericAmount: 0 })
      }
      groups.push({
        category: null,
        items: [{ amount: "", memo: "", numericAmount: 0 }]
      })

      setSplitGroups(groups)
    } else {
      // No existing splits, start fresh
      setSplitGroups([
        {
          category: selectedCategory,
          items: [{ amount: "", memo: "", numericAmount: 0 }]
        }
      ])
    }

    setSplitModalOpen(true)
  }

  const handleSplitSubmit = async () => {
    if (!transaction) return

    const isExpense = transaction.amount && transaction.amount.amountDecimal < 0
    const decimalDigits = 2

    const splitsToSend = getSplitsForSubmission(
      splitGroups,
      splitRemainder,
      selectedCategory?.id || null,
      isExpense ?? true,
      decimalDigits
    )

    if (splitsToSend.length === 0) return

    try {
      await splitTransaction({
        variables: {
          id: transaction.id,
          splits: splitsToSend
        },
        refetchQueries: [
          { query: TRANSACTION_QUERY, variables: { id } },
          { query: TRANSACTIONS_QUERY, variables: { limit: 50 } }
        ]
      })

      setSplitModalOpen(false)
    } catch (error) {
      console.error("Failed to split transaction:", error)
    }
  }

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
            <View className="flex-row items-center">
              {!isIncome && (
                <Pressable onPress={openSplitModal} className="p-2">
                  <Icon as={SplitIcon} className="size-6 text-foreground" />
                </Pressable>
              )}
              <Pressable onPress={toggleIncludeInReports} className="p-2">
                <Icon
                  as={includeInReports ? EyeIcon : EyeOffIcon}
                  className="size-6 text-foreground"
                />
              </Pressable>
            </View>
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
                      icon={split.category?.icon}
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

      <FormModal visible={splitModalOpen} onRequestClose={() => setSplitModalOpen(false)}>
        <View className="border-border mb-4 flex-row items-center justify-between border-b px-4 py-4">
          <Text variant="large">Split Transaction</Text>
          <TouchableOpacity onPress={() => setSplitModalOpen(false)}>
            <Icon as={XIcon} className="size-6 text-foreground" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="gap-4 px-4">
            <View className="flex-row items-center justify-between">
              <Text variant="large">{shop || "Split Transaction"}</Text>
              <Text className="text-muted-foreground">
                Total: {transaction?.amount?.formatted ?? "Pending"}
              </Text>
            </View>

            <SplitForm
              groups={splitGroups}
              onGroupsChange={setSplitGroups}
              remainder={splitRemainder}
              categories={categories}
            />
          </View>
        </ScrollView>

        <View className="mt-auto gap-2 px-4 py-4">
          <Button onPress={handleSplitSubmit} disabled={splitting}>
            {splitting ? <ActivityIndicator size="small" color="white" /> : <Text>Save Split</Text>}
          </Button>
        </View>
      </FormModal>
    </>
  )
}
