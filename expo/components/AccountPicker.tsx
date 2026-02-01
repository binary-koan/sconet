import { PickerModal } from "@/components/ui/picker-modal"
import { Text } from "@/components/ui/text"
import { AccountsQuery } from "@/lib/graphql/queries"
import { cn } from "@/lib/utils"
import { EllipsisIcon } from "lucide-react-native"
import { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { Icon } from "./ui/icon"

type Account = AccountsQuery["accounts"][number]

interface AccountPickerProps {
  accounts: Account[]
  selectedAccount: Account | null
  onSelect: (account: Account) => void
}

export function AccountPicker({ accounts, selectedAccount, onSelect }: AccountPickerProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (account: Account) => {
    onSelect(account)
    setOpen(false)
  }

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <View className="border-input bg-background flex h-10 flex-row items-center justify-between rounded-md border px-3 shadow-sm shadow-black/5">
          <Text className="flex-1" numberOfLines={1}>
            {selectedAccount
              ? `${selectedAccount.name} (${selectedAccount.currency?.code})`
              : "Select account"}
          </Text>
          <Icon as={EllipsisIcon} className="size-5 text-muted-foreground" />
        </View>
      </TouchableOpacity>

      <PickerModal open={open} onClose={() => setOpen(false)} title="Select Account" scrollable>
        <View className="gap-2">
          {accounts.map((account) => (
            <TouchableOpacity key={account.id} onPress={() => handleSelect(account)}>
              <View
                className={cn(
                  "rounded-lg p-4",
                  selectedAccount?.id === account.id && "bg-accent/20"
                )}
              >
                <Text>{account.name}</Text>
                <Text variant="small" className="text-muted-foreground">
                  {account.currency?.code}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </PickerModal>
    </>
  )
}
