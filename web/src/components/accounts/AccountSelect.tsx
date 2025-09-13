import { Component, For, JSX, Show, children } from "solid-js"
import { FullAccountFragment } from "../../graphql-types"
import { useAccountsQuery } from "../../graphql/queries/accountsQuery"
import { Dropdown, DropdownMenuItem } from "../Dropdown"

export const AccountSelect: Component<{
  value: string | null
  onChange: (account: FullAccountFragment) => void
  children: (selectedAccount: FullAccountFragment | undefined) => JSX.Element
}> = (props) => {
  const accounts = useAccountsQuery(() => ({ archived: false }))

  const toggle = children(() =>
    props.children(accounts()?.accounts.find((account) => account.id === props.value))
  )

  const favourites = () => (accounts()?.accounts || []).filter((a) => a.favourite)
  const others = () => (accounts()?.accounts || []).filter((a) => !a.favourite)

  return (
    <Dropdown
      closeOnItemClick
      content={
        <>
          <For each={favourites()}>
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
          <Show when={favourites().length > 0 && others().length > 0}>
            <div class="my-1 h-px w-full bg-gray-200" />
          </Show>
          <For each={others()}>
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
        </>
      }
    >
      {toggle()}
    </Dropdown>
  )
}
