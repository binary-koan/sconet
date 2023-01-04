import { TbEdit, TbTrash } from "solid-icons/tb"
import { Component, For } from "solid-js"
import toast from "solid-toast"
import { AccountMailboxesQuery } from "../../graphql-types"
import { useDeleteAccountMailbox } from "../../graphql/mutations/deleteAccountMailboxMutation"
import { Button, LinkButton } from "../base/Button"

const AccountMailboxesList: Component<{
  data: AccountMailboxesQuery
}> = (props) => {
  const deleteAccountMailbox = useDeleteAccountMailbox({
    onSuccess: () => toast.success("AccountMailbox deleted"),
    onError: (error) => toast.error(error.message)
  })

  const onDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete accountMailbox " + id + "?")) {
      deleteAccountMailbox({ id })
    }
  }

  return (
    <For each={props.data.accountMailboxes}>
      {(account) => (
        <div class="flex items-center bg-white px-4 py-2 shadow-sm">
          <div class="mr-4 min-w-0 flex-1">
            <h3 class="mb-1 truncate leading-none">{account.name}</h3>
            <p class="truncate text-xs leading-tight text-gray-600">
              {JSON.stringify(account.mailServerOptions)}
            </p>
          </div>
          <LinkButton
            href={`/account-mailboxes/${account.id}`}
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

export default AccountMailboxesList
