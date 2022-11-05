import { Box, Button, Text } from "@hope-ui/solid"
import { Link } from "@solidjs/router"
import { TbEdit, TbTrash } from "solid-icons/tb"
import { Component, For } from "solid-js"
import { Dynamic } from "solid-js/web"
import toast from "solid-toast"
import { AccountMailboxesQuery } from "../../graphql-types"
import { useDeleteAccountMailbox } from "../../graphql/mutations/deleteAccountMailboxMutation"

const AccountMailboxesList: Component<{
  data: AccountMailboxesQuery
}> = (props) => {
  const [deleteAccountMailbox] = useDeleteAccountMailbox({
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
        <Box
          display="flex"
          alignItems="center"
          paddingStart="$4"
          paddingEnd="$4"
          paddingTop="$2"
          paddingBottom="$2"
          backgroundColor="$neutral1"
          boxShadow="$xs"
        >
          <Box minWidth="0" marginEnd="$4" flex="1">
            <Text noOfLines={1} lineHeight="1" paddingBottom="$1">
              {account.name}
            </Text>
            <Text noOfLines={1} lineHeight="1" fontSize="$xs" color="gray.400">
              {JSON.stringify(account.mailServerOptions)}
            </Text>
          </Box>
          <Button
            as={Link}
            href={`/account-mailboxes/${account.id}`}
            size="sm"
            marginStart="auto"
            marginEnd="$2"
            title={"Edit account " + account.id}
          >
            <Dynamic component={TbEdit} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            colorScheme="danger"
            title={"Delete account " + account.id}
            onClick={() => onDeleteClick(account.id)}
          >
            <Dynamic component={TbTrash} />
          </Button>
        </Box>
      )}
    </For>
  )
}

export default AccountMailboxesList
