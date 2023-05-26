import { useNavigate } from "@solidjs/router"
import { TbChevronDown, TbExternalLink } from "solid-icons/tb"
import { Component, For } from "solid-js"
import { FullCurrencyFragment } from "../../graphql-types"
import { useSetDefaultCurrency } from "../../graphql/mutations/setDefaultCurrency"
import { Dropdown, DropdownMenuItem } from "../Dropdown"
import { Button } from "../base/Button"

export const DefaultCurrencySelect: Component<{
  defaultCurrency: FullCurrencyFragment
  favoriteCurrencies: FullCurrencyFragment[]
}> = (props) => {
  const navigate = useNavigate()
  const setDefaultCurrency = useSetDefaultCurrency()

  return (
    <Dropdown
      closeOnItemClick
      class="text-base font-normal"
      content={
        <>
          <For each={props.favoriteCurrencies}>
            {(currency) => (
              <DropdownMenuItem onClick={() => setDefaultCurrency({ code: currency.code })}>
                {currency.code}
              </DropdownMenuItem>
            )}
          </For>
          <DropdownMenuItem class="text-xs" onClick={() => navigate("/settings/currencies")}>
            Manage favorites
            <TbExternalLink />
          </DropdownMenuItem>
        </>
      }
    >
      <Button variant="ghost">
        {props.defaultCurrency.code}
        <TbChevronDown class="ml-1" />
      </Button>
    </Dropdown>
  )
}
