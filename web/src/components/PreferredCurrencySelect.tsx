import { TbChevronDown } from "solid-icons/tb"
import { Component, For } from "solid-js"
import { FullCurrencyFragment } from "../graphql-types"
import { preferredCurrency, setPreferredCurrency } from "../utils/settings"
import { Dropdown, DropdownMenuItem } from "./Dropdown"
import { Button } from "./base/Button"

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
            <DropdownMenuItem onClick={() => setPreferredCurrency(currency.code)}>
              {currency.code}
            </DropdownMenuItem>
          )}
        </For>
      }
    >
      <Button variant="ghost">
        {props.currencies.find((currency) => currency.code === preferredCurrency())?.code}
        <TbChevronDown class="ml-1" />
      </Button>
    </Dropdown>
  )
}
