import { TbEdit } from "solid-icons/tb"
import { Component, For, Show } from "solid-js"
import { CurrentUserQuery } from "../../graphql-types"
import { LinkButton } from "../base/Button"

export const CurrentUserProfile: Component<{
  data: CurrentUserQuery
}> = (props) => {
  const currentUser = () => props.data.currentUser!

  return (
    <>
      <div class="bg-white py-2 px-4 shadow-sm">
        <div class="text-xs text-gray-600">Email</div>
        {currentUser().email}
      </div>

      <div class="bg-white py-2 px-4 shadow-sm">
        <div class="text-xs text-gray-600">Default currency</div>
        {currentUser().defaultCurrency.code} ({currentUser().defaultCurrency.name})
      </div>

      <div class="bg-white py-2 px-4 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-600">Favourite currencies</span>
          <LinkButton
            href="/settings/currencies"
            size="sm"
            variant="ghost"
            colorScheme="neutral"
            class="-mt-4 -mb-4"
          >
            <TbEdit />
          </LinkButton>
        </div>
        <Show when={currentUser().favoriteCurrencies.length === 0}>
          <div class="italic">No favourite currencies</div>
        </Show>
        <For each={currentUser().favoriteCurrencies}>
          {(currency) => (
            <div>
              {currency.code} ({currency.name})
            </div>
          )}
        </For>
      </div>
    </>
  )
}
