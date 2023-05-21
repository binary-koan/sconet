import { TbEdit, TbTrash } from "solid-icons/tb"
import { Component, For } from "solid-js"
import toast from "solid-toast"
import { AccountsQuery } from "../../graphql-types"
import { useDeleteAccount } from "../../graphql/mutations/deleteAccountMutation"
import { Button, LinkButton } from "../base/Button"

const AccountsList: Component<{
  data: AccountsQuery
}> = (props) => {
  const deleteAccount = useDeleteAccount({
    onSuccess: () => toast.success("Account deleted"),
    onError: (error) => toast.error(error.message)
  })

  const onDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete account " + id + "?")) {
      deleteAccount({ id })
    }
  }

  return (
    <For each={props.data.accounts}>
      {(account) => (
        <div class="flex items-center bg-white px-4 py-2 shadow-sm">
          <div class="mr-4 min-w-0 flex-1">
            <h3 class="mb-1 truncate leading-none">{account.name}</h3>
          </div>
          <LinkButton
            href={`/accounts/${account.id}`}
            size="sm"
            variant="ghost"
            class="ml-auto mr-2"
            title={"Edit account " + account.id}
          >
            <TbEdit />
          </LinkButton>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="danger"
            title={"Delete account " + account.id}
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
