import { Component, For, JSX, children } from "solid-js"
import { FullAccountFragment } from "../../graphql-types.ts"
import { useAccountsQuery } from "../../graphql/queries/accountsQuery.ts"
import { Dropdown, DropdownMenuItem } from "../Dropdown.tsx"

export const AccountSelect: Component<{
  value: string | null
  onChange: (account: FullAccountFragment) => void
  children: (selectedAccount: FullAccountFragment | undefined) => JSX.Element
}> = (props) => {
  const accounts = useAccountsQuery(() => ({ archived: false }))

  const toggle = children(() =>
    props.children(accounts()?.accounts.find((account) => account.id === props.value))
  )

  return (
    <Dropdown
      closeOnItemClick
      content={
        <For each={accounts()?.accounts}>
          {(account) => (
            <DropdownMenuItem
              data-testid="account-item"
              class="text-sm"
              onClick={() => props.onChange(account)}
            >
              {account.name} ({account.currency.code})
            </DropdownMenuItem>
          )}
        </For>
      }
    >
      {toggle()}
    </Dropdown>
  )
}
