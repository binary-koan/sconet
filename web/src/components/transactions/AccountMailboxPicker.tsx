import { Component, For } from "solid-js"
import { FullAccountMailboxFragment } from "../../graphql-types"
import { useAccountMailboxesQuery } from "../../graphql/queries/accountMailboxesQuery"
import { Button } from "../base/Button"

export type ValueProps = {
  value: FullAccountMailboxFragment | undefined
  onChange: (accountMailbox: FullAccountMailboxFragment) => void
}

const AccountMailboxPicker: Component<ValueProps> = (props) => {
  const data = useAccountMailboxesQuery()

  return (
    <div class="flex flex-wrap gap-2">
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
  accountMailbox: FullAccountMailboxFragment
  valueProps: ValueProps
}> = (props) => {
  const onClick = () => {
    props.valueProps.onChange(props.accountMailbox)
  }

  const isCurrent = props.valueProps.value?.id === props.accountMailbox.id

  return (
    <Button
      size="sm"
      colorScheme={isCurrent ? "primary" : "neutral"}
      variant={isCurrent ? "solid" : "ghost"}
      onClick={onClick}
    >
      <span class="min-w-0 truncate">{props.accountMailbox.name}</span>
    </Button>
  )
}
