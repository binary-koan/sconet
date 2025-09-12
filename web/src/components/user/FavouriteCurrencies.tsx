import { IconAsterisk } from "@tabler/icons-solidjs"
import { Component, For, Show } from "solid-js"
import toast from "solid-toast"
import { CurrentUserQuery } from "../../graphql-types"
import { useSetDefaultCurrency } from "../../graphql/mutations/setDefaultCurrency"
import { Button } from "../base/Button"

export const FavouriteCurrencies: Component<{
  data: CurrentUserQuery
}> = (props) => {
  const currentUser = () => props.data.currentUser!

  const setDefaultCurrency = useSetDefaultCurrency({
    onSuccess: () => toast.success("Default currency updated")
  })

  return (
    <div class="shadow-xs flex flex-col gap-px bg-gray-100">
      <Show when={currentUser().favouriteCurrencies.length === 0}>
        <div class="italic">No favourite currencies</div>
      </Show>
      <For each={currentUser().favouriteCurrencies}>
        {(currency) => (
          <div class="flex items-center justify-between bg-white px-4 py-1">
            {currency.code} ({currency.name})
            <Button
              size="sm"
              variant="ghost"
              colorScheme={
                currency.id === currentUser().defaultCurrency?.id ? "primary" : "neutral"
              }
              onClick={() => setDefaultCurrency({ id: currency.id })}
              class="gap-2 text-xs"
            >
              {currency.id === currentUser().defaultCurrency?.id && "Default "}
              <IconAsterisk />
            </Button>
          </div>
        )}
      </For>
    </div>
  )
}
