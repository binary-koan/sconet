import { Box, Button, Text } from "@hope-ui/solid"
import { gql } from "@solid-primitives/graphql"
import { Component, For } from "solid-js"
import { AccountMailboxOptionsQuery } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"

export type AccountMailboxOption = AccountMailboxOptionsQuery["accountMailboxes"][0]

export type ValueProps = {
  value: AccountMailboxOption | undefined
  onChange: (accountMailbox: AccountMailboxOption) => void
}

const accountMailboxesQuery = gql`
  query AccountMailboxOptions {
    accountMailboxes {
      id
      name
    }
  }
`

const AccountMailboxPicker: Component<ValueProps> = (props) => {
  const [data] = useQuery<AccountMailboxOptionsQuery>(accountMailboxesQuery)

  return (
    <Box display="flex" flexDirection="column" gap="2">
      <For each={data()?.accountMailboxes}>
        {(accountMailbox) => (
          <AccountMailboxOption accountMailbox={accountMailbox} valueProps={props} />
        )}
      </For>
    </Box>
  )
}

export default AccountMailboxPicker

const AccountMailboxOption: Component<{
  accountMailbox: AccountMailboxOption
  valueProps: ValueProps
}> = (props) => {
  const onClick = () => {
    props.valueProps.onChange(props.accountMailbox)
  }

  const isCurrent = props.valueProps.value?.id === props.accountMailbox.id

  return (
    <Button
      size="sm"
      display="block"
      width="full"
      colorScheme={isCurrent ? "primary" : "neutral"}
      variant={isCurrent ? "solid" : "ghost"}
      onClick={onClick}
    >
      <Box display="flex" alignItems="center" gap="2">
        <Text minWidth="0" noOfLines={1}>
          {props.accountMailbox.name}
        </Text>
      </Box>
    </Button>
  )
}
