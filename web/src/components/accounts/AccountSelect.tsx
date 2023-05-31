import { Component, For, JSX, children } from "solid-js"
import { FullAccountFragment } from "../../graphql-types"
import { useAccountsQuery } from "../../graphql/queries/accountsQuery"
import { Dropdown, DropdownMenuItem } from "../Dropdown"

export const AccountSelect: Component<{
  value?: string
  onChange: (account: FullAccountFragment) => void
  children: (selectedCurrency: FullAccountFragment | undefined) => JSX.Element
}> = (props) => {
  const accounts = useAccountsQuery()

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
              {account.name} ({account.currencyCode})
            </DropdownMenuItem>
          )}
        </For>
      }
    >
      {toggle()}
    </Dropdown>
  )
}
