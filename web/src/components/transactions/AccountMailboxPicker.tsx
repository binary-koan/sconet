import { Component, For } from "solid-js"
import { AccountMailboxOptionsQuery } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { Button } from "../base/Button"

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
    <div class="flex flex-col gap-2">
      <For each={data()?.accountMailboxes}>
        {(accountMailbox) => (
          <AccountMailboxOption accountMailbox={accountMailbox} valueProps={props} />
        )}
      </For>
    </div>
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
      class="block w-full"
      colorScheme={isCurrent ? "primary" : "neutral"}
      variant={isCurrent ? "solid" : "ghost"}
      onClick={onClick}
    >
      <span class="min-w-0 truncate">{props.accountMailbox.name}</span>
    </Button>
  )
}
