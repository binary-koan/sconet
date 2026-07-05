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
    <div class="flex flex-col px-2">
      <Show when={currentUser().favouriteCurrencies.length === 0}>
        <div class="not-first:border-t-0 border border-gray-100 bg-white px-4 py-2 italic first:rounded-t-3xl last:rounded-b-3xl">
          No favourite currencies
        </div>
      </Show>
      <For each={currentUser().favouriteCurrencies}>
        {(currency) => (
          <div class="not-first:border-t-0 flex items-center justify-between border border-gray-100 bg-white px-4 py-1 first:rounded-t-3xl last:rounded-b-3xl">
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
