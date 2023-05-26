import { TbAsterisk } from "solid-icons/tb"
import { Component, For, Show } from "solid-js"
import toast from "solid-toast"
import { CurrentUserQuery } from "../../graphql-types"
import { useSetDefaultCurrency } from "../../graphql/mutations/setDefaultCurrency"
import { Button } from "../base/Button"

export const FavoriteCurrencies: Component<{
  data: CurrentUserQuery
}> = (props) => {
  const currentUser = () => props.data.currentUser!

  const setDefaultCurrency = useSetDefaultCurrency({
    onSuccess: () => toast.success("Default currency updated")
  })

  return (
    <div class="bg-white px-4 shadow-sm">
      <Show when={currentUser().favoriteCurrencies.length === 0}>
        <div class="italic">No favourite currencies</div>
      </Show>
      <For each={currentUser().favoriteCurrencies}>
        {(currency) => (
          <div class="flex items-center justify-between py-1">
            {currency.code} ({currency.name})
            <Button
              size="sm"
              variant="ghost"
              colorScheme={
                currency.code === currentUser().defaultCurrency.code ? "primary" : "neutral"
              }
              onClick={() => setDefaultCurrency({ code: currency.code })}
            >
              <TbAsterisk />
            </Button>
          </div>
        )}
      </For>
    </div>
  )
}