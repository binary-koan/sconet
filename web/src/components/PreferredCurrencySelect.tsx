import { TbChevronDown } from "solid-icons/tb"
import { Component, For } from "solid-js"
import { FullCurrencyFragment } from "../graphql-types"
import { preferredCurrency, setPreferredCurrency } from "../utils/settings"
import { Button } from "./base/Button"
import { Dropdown, DropdownMenuItem } from "./Dropdown"

export const PreferredCurrencySelect: Component<{ currencies: FullCurrencyFragment[] }> = (
  props
) => {
  return (
    <Dropdown
      closeOnItemClick
      class="text-base font-normal"
      content={
        <For each={props.currencies}>
          {(currency) => (
            <DropdownMenuItem onClick={() => setPreferredCurrency(currency.id)}>
              {currency.code}
            </DropdownMenuItem>
          )}
        </For>
      }
    >
      <Button variant="ghost">
        {props.currencies.find((currency) => currency.id === preferredCurrency())?.code}
        <TbChevronDown class="ml-1" />
      </Button>
    </Dropdown>
  )
}
