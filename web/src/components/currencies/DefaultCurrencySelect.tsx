import { useNavigate } from "@solidjs/router"
import { IconChevronDown, IconExternalLink } from "@tabler/icons-solidjs"
import { Component, For } from "solid-js"
import { FullCurrencyFragment } from "../../graphql-types"
import { useSetDefaultCurrency } from "../../graphql/mutations/setDefaultCurrency"
import { Dropdown, DropdownMenuItem } from "../Dropdown"
import { Button } from "../base/Button"

export const DefaultCurrencySelect: Component<{
  defaultCurrency: FullCurrencyFragment | null | undefined
  favouriteCurrencies: FullCurrencyFragment[]
}> = (props) => {
  const navigate = useNavigate()
  const setDefaultCurrency = useSetDefaultCurrency()

  return (
    <Dropdown
      closeOnItemClick
      class="text-base font-normal"
      content={
        <>
          <For each={props.favouriteCurrencies}>
            {(currency) => (
              <DropdownMenuItem onClick={() => setDefaultCurrency({ id: currency.id })}>
                {currency.code}
              </DropdownMenuItem>
            )}
          </For>
          <DropdownMenuItem class="text-xs" onClick={() => navigate("/settings/currencies")}>
            Manage favorites
            <IconExternalLink />
          </DropdownMenuItem>
        </>
      }
    >
      <Button variant="ghost">
        {props.defaultCurrency?.code || "-"}
        <IconChevronDown class="ml-1" />
      </Button>
    </Dropdown>
  )
}
