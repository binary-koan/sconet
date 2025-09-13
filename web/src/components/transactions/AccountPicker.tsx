import { Component, For, Show } from "solid-js"
import { FullAccountFragment } from "../../graphql-types"
import { useAccountsQuery } from "../../graphql/queries/accountsQuery"
import { Button } from "../base/Button"

export interface AccountBasicDetails {
  id: string
  name: string
  currency: { id: string }
}

export type ValueProps = {
  value: AccountBasicDetails | undefined
  onChange: (account: AccountBasicDetails) => void
}

const AccountPicker: Component<ValueProps> = (props) => {
  const data = useAccountsQuery(() => ({ archived: false }))

  const favourites = () => (data()?.accounts || []).filter((a) => a.favourite)
  const others = () => (data()?.accounts || []).filter((a) => !a.favourite)

  return (
    <div class="flex flex-wrap gap-2">
      <For each={favourites()}>
        {(account) => <AccountOption account={account} valueProps={props} />}
      </For>
      <Show when={favourites().length > 0 && others().length > 0}>
        <div class="basis-full border-b border-gray-200" />
      </Show>
      <For each={others()}>
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

  const isCurrent = () => props.valueProps.value?.id === props.account.id

  return (
    <Button
      size="sm"
      colorScheme={isCurrent() ? "primary" : "neutral"}
      variant={isCurrent() ? "solid" : "ghost"}
      onClick={onClick}
    >
      <span class="min-w-0 truncate">
        {props.account.name} ({props.account.currency.code})
      </span>
    </Button>
  )
}
