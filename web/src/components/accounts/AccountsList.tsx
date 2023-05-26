import { TbAsterisk, TbEdit, TbTrash } from "solid-icons/tb"
import { Component, For } from "solid-js"
import toast from "solid-toast"
import { AccountsQuery, CurrentUserQuery } from "../../graphql-types"
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

  const onDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete account " + id + "?")) {
      deleteAccount({ id })
    }
  }

  const setDefaultAccount = useSetDefaultAccount({
    onSuccess: () => toast.success("Default account updated")
  })

  const defaultAccountId = () => props.currentUser?.currentUser?.defaultAccount?.id

  return (
    <For each={props.data.accounts}>
      {(account) => (
        <div class="flex items-center bg-white px-4 py-2 shadow-sm">
          <div class="mr-4 min-w-0 flex-1">
            <h3 class="mb-1 truncate leading-none">{account.name}</h3>
            <p class="text-xs leading-tight text-gray-600">{account.currencyCode}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            colorScheme={account.id === defaultAccountId() ? "primary" : "neutral"}
            class="ml-auto mr-2"
            title={"Set default to " + account.name}
            onClick={() => setDefaultAccount({ id: account.id })}
          >
            <TbAsterisk />
          </Button>
          <LinkButton
            href={`/accounts/${account.id}`}
            size="sm"
            variant="ghost"
            class="ml-auto mr-2"
            title={"Edit account " + account.name}
          >
            <TbEdit />
          </LinkButton>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="danger"
            title={"Delete account " + account.name}
            onClick={() => onDeleteClick(account.id)}
          >
            <TbTrash />
          </Button>
        </div>
      )}
    </For>
  )
}

export default AccountsList
