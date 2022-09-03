import { Box, Button, Icon, Text } from "@hope-ui/solid"
import { gql } from "@solid-primitives/graphql"
import { Link } from "@solidjs/router"
import { TbEdit, TbTrash } from "solid-icons/tb"
import { Component, For } from "solid-js"
import { FindAccountMailboxesQuery } from "../../graphql-types"
import { useMutation } from "../../graphqlClient"
import { ACCOUNT_MAILBOXES_QUERY } from "./AccountMailboxesCell"

const DELETE_ACCOUNT_MAILBOX_MUTATION = gql`
  mutation DeleteAccountMailboxMutation($id: String!) {
    deleteAccountMailbox(id: $id) {
      id
    }
  }
`

const AccountMailboxesList: Component<{
  accountMailboxes: FindAccountMailboxesQuery["accountMailboxes"]
}> = (props) => {
  const [deleteAccountMailbox] = useMutation(DELETE_ACCOUNT_MAILBOX_MUTATION, {
    // onCompleted: () => {
    //   toast('AccountMailbox deleted')
    // },
    // onError: (error) => {
    //   toast(error.message)
    // },
    refetchQueries: [ACCOUNT_MAILBOXES_QUERY]
  })

  const onDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete accountMailbox " + id + "?")) {
      deleteAccountMailbox({ variables: { id } })
    }
  }

  return (
    <For each={props.accountMailboxes}>
      {(account) => (
        <Box
          display="flex"
          alignItems="center"
          paddingStart="$4"
          paddingEnd="$4"
          paddingTop="$2"
          paddingBottom="$2"
          backgroundColor="$neutral1"
          boxShadow="xs"
        >
          <Box minWidth="0" marginEnd="$4" flex="1">
            <Text noOfLines={1} lineHeight="1" paddingBottom="1">
              {account.name}
            </Text>
            <Text noOfLines={1} lineHeight="1" fontSize="xs" color="gray.400">
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
            <Icon as={TbEdit} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            colorScheme="danger"
            title={"Delete account " + account.id}
            onClick={() => onDeleteClick(account.id)}
          >
            <Icon as={TbTrash} />
          </Button>
        </Box>
      )}
    </For>
  )
}

export default AccountMailboxesList
