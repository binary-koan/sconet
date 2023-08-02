import { Component, For, JSX, children } from "solid-js"
import { FullCurrencyFragment } from "../../graphql-types"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery"
import { Dropdown, DropdownMenuItem } from "../Dropdown"

export const CurrencySelect: Component<{
  value: string
  onChange: (code: string) => void
  children: (selectedCurrency: FullCurrencyFragment | undefined) => JSX.Element
  filter?: (currency: FullCurrencyFragment) => boolean
}> = (props) => {
  const currencies = useCurrenciesQuery()

  const toggle = children(() =>
    props.children(currencies()?.currencies.find((currency) => currency.code === props.value))
  )

  return (
    <Dropdown
      closeOnItemClick
      content={
        <For each={currencies()?.currencies.filter(props.filter || (() => true))}>
          {(currency) => (
            <DropdownMenuItem class="text-sm" onClick={() => props.onChange(currency.code)}>
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
