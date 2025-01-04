import { orderBy } from "lodash"
import { Component, For, JSX, children } from "solid-js"
import { FullCurrencyFragment } from "../../graphql-types"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery"
import { useCurrentUserQuery } from "../../graphql/queries/currentUserQuery"
import { Dropdown, DropdownMenuItem } from "../Dropdown"

export const CurrencySelect: Component<{
  value: string | null
  onChange: (id: string) => void
  children: (selectedCurrency: FullCurrencyFragment | undefined) => JSX.Element
  filter?: (currency: FullCurrencyFragment) => boolean
}> = (props) => {
  const currencies = useCurrenciesQuery()
  const currentUser = useCurrentUserQuery()

  const toggle = children(() =>
    props.children(currencies()?.currencies.find((currency) => currency.id === props.value))
  )

  const orderedCurrencies = () =>
    orderBy(currencies()?.currencies, [
      (currency) =>
        -(
          currentUser()
            ?.currentUser?.favouriteCurrencies.map((currency) => currency.id)
            .indexOf(currency.id) ?? 99999
        ),
      (currency) => currency.id
    ])

  return (
    <Dropdown
      closeOnItemClick
      content={
        <For each={orderedCurrencies().filter(props.filter || (() => true))}>
          {(currency) => (
            <DropdownMenuItem class="text-sm" onClick={() => props.onChange(currency.id)}>
              {currency.code}
            </DropdownMenuItem>
          )}
        </For>
      }
    >
      {toggle()}
    </Dropdown>
  )
}
