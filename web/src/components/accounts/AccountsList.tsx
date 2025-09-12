import { IconArchive, IconAsterisk, IconEdit, IconTrash } from "@tabler/icons-solidjs"
import { Component, For } from "solid-js"
import toast from "solid-toast"
import { AccountsQuery, CurrentUserQuery } from "../../graphql-types"
import { useArchiveAccount } from "../../graphql/mutations/archiveAccountMutation"
import { useDeleteAccount } from "../../graphql/mutations/deleteAccountMutation"
import { useSetDefaultAccount } from "../../graphql/mutations/setDefaultAccount"
import { Button, LinkButton } from "../base/Button"

const AccountsList: Component<{
  data: AccountsQuery
  currentUser?: CurrentUserQuery
}> = (props) => {
  const deleteAccount = useDeleteAccount({
    onSuccess: () => toast.success("Account deleted")
  })

  const archiveAccount = useArchiveAccount({
    onSuccess: () => toast.success("Account archived")
  })

  const onDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete account " + id + "?")) {
      deleteAccount({ id })
    }
  }

  const onArchiveClick = (id: string) => {
    if (confirm("Are you sure you want to archive account " + id + "?")) {
      archiveAccount({ id })
    }
  }

  const setDefaultAccount = useSetDefaultAccount({
    onSuccess: () => toast.success("Default account updated")
  })

  const defaultAccountId = () => props.currentUser?.currentUser?.defaultAccount?.id

  return (
    <div class="flex flex-col gap-px bg-gray-100 shadow-sm">
      <For each={props.data.accounts}>
        {(account) => (
          <div class="flex items-center bg-white px-4 py-2 shadow-sm">
            <div class="mr-4 min-w-0 flex-1">
              <h3 class="mb-1 truncate leading-none">{account.name}</h3>
              <p class="text-xs leading-tight text-gray-600">{account.currency.code}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              colorScheme={account.id === defaultAccountId() ? "primary" : "neutral"}
              class="ml-auto mr-2"
              title={"Set default to " + account.name}
              onClick={() => setDefaultAccount({ id: account.id })}
            >
              <IconAsterisk />
            </Button>
            <LinkButton
              href={`/accounts/${account.id}`}
              size="sm"
              variant="ghost"
              class="ml-auto mr-2"
              title={"Edit account " + account.name}
            >
              <IconEdit />
            </LinkButton>
            {account.hasTransactions ? (
              <Button
                size="sm"
                variant="ghost"
                title={"Archive account " + account.name}
                onClick={() => onArchiveClick(account.id)}
              >
                <IconArchive />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                colorScheme="danger"
                title={"Delete account " + account.name}
                onClick={() => onDeleteClick(account.id)}
              >
                <IconTrash />
              </Button>
            )}
          </div>
        )}
      </For>
    </div>
  )
}

export default AccountsList
