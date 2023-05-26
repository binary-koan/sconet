import { Component, For } from "solid-js"
import { FullAccountFragment } from "../../graphql-types"
import { useAccountsQuery } from "../../graphql/queries/accountsQuery"
import { Button } from "../base/Button"

export interface AccountBasicDetails {
  id: string
  name: string
  currencyCode: string
}

export type ValueProps = {
  value: AccountBasicDetails | undefined
  onChange: (account: AccountBasicDetails) => void
}

const AccountPicker: Component<ValueProps> = (props) => {
  const data = useAccountsQuery()

  return (
    <div class="flex flex-wrap gap-2">
      <For each={data()?.accounts}>
        {(account) => <AccountOption account={account} valueProps={props} />}
      </For>
    </div>
  )
}

export default AccountPicker

const AccountOption: Component<{
  account: FullAccountFragment
  valueProps: ValueProps
}> = (props) => {
  const onClick = () => {
    props.valueProps.onChange(props.account)
  }

  const isCurrent = props.valueProps.value?.id === props.account.id

  return (
    <Button
      size="sm"
      colorScheme={isCurrent ? "primary" : "neutral"}
      variant={isCurrent ? "solid" : "ghost"}
      onClick={onClick}
    >
      <span class="min-w-0 truncate">
        {props.account.name} ({props.account.currencyCode})
      </span>
    </Button>
  )
}
