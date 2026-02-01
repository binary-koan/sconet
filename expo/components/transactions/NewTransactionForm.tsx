import { AccountPicker } from "@/components/AccountPicker"
import { AmountType, AmountTypePicker } from "@/components/AmountTypePicker"
import { CategoryPicker } from "@/components/CategoryPicker"
import { DatePicker } from "@/components/DatePicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { useTransactionCreateMutation, useTransactionSplitMutation } from "@/lib/graphql/mutations"
import {
  AccountsQuery,
  TRANSACTIONS_QUERY,
  useAccountsQuery,
  useCategoriesQuery
} from "@/lib/graphql/queries"
import { Category } from "@/lib/graphql/types"
import { CombinedGraphQLErrors } from "@apollo/client"
import { SplitIcon, XIcon } from "lucide-react-native"
import { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Modal, ScrollView, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../ui/icon"
import {
  createInitialGroups,
  getSplitsForSubmission,
  parseNumericAmount,
  SplitForm,
  SplitGroup
} from "./SplitForm"

type Account = AccountsQuery["accounts"][number]

interface NewTransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function NewTransactionForm({ open, onOpenChange, onSuccess }: NewTransactionFormProps) {
  const [shop, setShop] = useState("")
  const [memo, setMemo] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [amountType, setAmountType] = useState<AmountType>("expense")
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [splittingTransactionId, setSplittingTransactionId] = useState<string | null>(null)
  const [splitGroups, setSplitGroups] = useState<SplitGroup[]>(createInitialGroups())
  const insets = useSafeAreaInsets()

  const { data: categoriesData } = useCategoriesQuery()
  const { data: accountsData } = useAccountsQuery()
  const [createTransaction, { loading: createLoading }] = useTransactionCreateMutation()
  const [splitTransaction, { loading: splitLoading }] = useTransactionSplitMutation()
  const loading = createLoading || splitLoading

  const categories = useMemo(() => categoriesData?.categories ?? [], [categoriesData?.categories])
  const accounts = useMemo(() => accountsData?.accounts ?? [], [accountsData?.accounts])

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0])
    }
  }, [accounts, selectedAccount])

  const resetForm = () => {
    setShop("")
    setMemo("")
    setAmount("")
    setSelectedCategory(null)
    setSelectedDate(new Date())
    setAmountType("expense")
    setSelectedAccount(accounts[0] ?? null)
    setSplittingTransactionId(null)
    setSplitGroups(createInitialGroups())
  }

  const splitMode = splittingTransactionId !== null

  const splitRemainder = useMemo(() => {
    const total = parseNumericAmount(amount)
    const splitSum = splitGroups.reduce(
      (acc, group) => acc + group.items.reduce((sum, item) => sum + item.numericAmount, 0),
      0
    )
    return parseFloat((total - splitSum).toFixed(2))
  }, [amount, splitGroups])

  const handleSubmit = async (andSplit = false) => {
    if (!shop.trim() || !amount.trim()) return

    const amountDecimal = parseFloat(amount.replace(/[^0-9.-]/g, ""))
    if (isNaN(amountDecimal)) return

    const amountCents = Math.round(amountDecimal * 100)
    const signedAmount = amountType === "expense" ? -Math.abs(amountCents) : Math.abs(amountCents)

    try {
      const result = await createTransaction({
        variables: {
          transactionInput: {
            shop: shop.trim(),
            memo: memo.trim() || undefined,
            amountCents: signedAmount,
            categoryId: amountType === "expense" ? selectedCategory?.id : undefined,
            accountId: selectedAccount?.id,
            currencyId: selectedAccount?.currency.id,
            date: formatDate(selectedDate)
          }
        },
        refetchQueries: [{ query: TRANSACTIONS_QUERY, variables: { limit: 50 } }]
      })

      if (andSplit && result.data?.transactionCreate.transaction.id) {
        setSplittingTransactionId(result.data.transactionCreate.transaction.id)
        setSplitGroups(createInitialGroups(selectedCategory))
      } else {
        resetForm()
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (error) {
      console.error("Failed to create transaction:", error)
      if (error instanceof CombinedGraphQLErrors) {
        console.error(JSON.stringify(error.errors, null, 2))
      }
    }
  }

  const handleSplitSubmit = async () => {
    if (!splittingTransactionId) return

    try {
      const splitsToSend = getSplitsForSubmission(
        splitGroups,
        splitRemainder,
        selectedCategory?.id || null,
        amountType === "expense",
        2
      )

      if (splitsToSend.length > 0) {
        await splitTransaction({
          variables: {
            id: splittingTransactionId,
            splits: splitsToSend
          },
          refetchQueries: [{ query: TRANSACTIONS_QUERY, variables: { limit: 50 } }]
        })
      }

      resetForm()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Failed to split transaction:", error)
      if (error instanceof CombinedGraphQLErrors) {
        console.error(JSON.stringify(error.errors, null, 2))
      }
    }
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const isValid =
    shop.trim() && amount.trim() && !isNaN(parseFloat(amount.replace(/[^0-9.-]/g, "")))

  return (
    <Modal
      visible={open}
      presentationStyle="formSheet"
      animationType="slide"
      onRequestClose={handleClose}
      className="bg-background"
    >
      <View className="bg-background flex-1" style={{ paddingBottom: insets.bottom }}>
        <View className="border-border mb-4 flex-row items-center justify-between border-b px-4 py-4">
          <Text variant="large">New Transaction</Text>
          <TouchableOpacity onPress={handleClose}>
            <Icon as={XIcon} className="size-6 text-foreground" />
          </TouchableOpacity>
        </View>

        {splitMode ? (
          <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
            <View className="gap-4 px-4">
              <View className="flex-row items-center justify-between">
                <Text variant="large">{shop || "Split Transaction"}</Text>
                <Text className="text-muted-foreground">
                  Total: {selectedAccount?.currency?.symbol ?? "$"}
                  {amount || "0"}
                </Text>
              </View>

              <SplitForm
                groups={splitGroups}
                onGroupsChange={setSplitGroups}
                remainder={splitRemainder}
                showCategories={amountType === "expense"}
                categories={categories}
              />
            </View>
          </ScrollView>
        ) : (
          <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
            <View className="gap-4 px-4">
              <View className="gap-2">
                <Text variant="small" className="text-muted-foreground">
                  Where?
                </Text>
                <Input value={shop} onChangeText={setShop} autoFocus />
              </View>

              <View className="gap-2">
                <Text variant="small" className="text-muted-foreground">
                  What?
                </Text>
                <Input value={memo} onChangeText={setMemo} />
              </View>

              <View className="gap-2">
                <Text variant="small" className="text-muted-foreground">
                  Amount
                </Text>
                <View className="relative">
                  <Input
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    placeholder={selectedAccount?.currency?.symbol ?? "$"}
                  />
                  <View className="absolute top-0 right-0">
                    <AmountTypePicker value={amountType} onChange={setAmountType} />
                  </View>
                </View>
              </View>

              {amountType === "expense" && (
                <View className="gap-2">
                  <Text variant="small" className="text-muted-foreground">
                    Category
                  </Text>
                  <CategoryPicker
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                  />
                </View>
              )}

              <View className="gap-2">
                <Text variant="small" className="text-muted-foreground">
                  Date
                </Text>
                <DatePicker value={selectedDate} onChange={setSelectedDate} />
              </View>

              <View className="gap-2">
                <Text variant="small" className="text-muted-foreground">
                  Account
                </Text>
                <AccountPicker
                  accounts={accounts}
                  selectedAccount={selectedAccount}
                  onSelect={setSelectedAccount}
                />
              </View>
            </View>
          </ScrollView>
        )}

        {splitMode ? (
          <View className="mt-auto gap-2 px-4 py-4">
            <Button className="flex-1" onPress={handleSplitSubmit} disabled={splitLoading}>
              {splitLoading ? <ActivityIndicator size="small" color="white" /> : <Text>Split</Text>}
            </Button>
            <Button variant="ghost" className="flex-1" onPress={handleClose}>
              <Text>Cancel</Text>
            </Button>
          </View>
        ) : (
          <View className="mt-auto gap-2 px-4 py-4">
            <Button
              className="flex-1"
              onPress={() => handleSubmit(false)}
              disabled={!isValid || loading}
            >
              {loading ? <ActivityIndicator size="small" color="white" /> : <Text>Save</Text>}
            </Button>
            <Button
              variant="ghost"
              className="flex-1"
              onPress={() => handleSubmit(true)}
              disabled={!isValid || loading}
            >
              <Icon as={SplitIcon} className="size-4 text-foreground mr-2" />
              <Text>Save & Split</Text>
            </Button>
          </View>
        )}
      </View>
    </Modal>
  )
}
