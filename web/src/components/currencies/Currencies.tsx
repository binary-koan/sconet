import { TbStar } from "solid-icons/tb"
import { Component, For, Show } from "solid-js"
import toast from "solid-toast"
import { CurrenciesQuery, CurrentUserQuery, FullCurrencyFragment } from "../../graphql-types"
import { useFavoriteCurrency } from "../../graphql/mutations/favoriteCurrency"
import { useSetDefaultCurrency } from "../../graphql/mutations/setDefaultCurrency"
import { useUnfavoriteCurrency } from "../../graphql/mutations/unfavoriteCurrency"
import { Button } from "../base/Button"

export const CurrenciesList: Component<{
  data: CurrenciesQuery
  currentUser?: CurrentUserQuery
}> = (props) => {
  const defaultCurrency = () => props.currentUser?.currentUser?.defaultCurrency
  const favoriteCurrencies = () => props.currentUser?.currentUser?.favoriteCurrencies || []
  const otherCurrencies = () =>
    props.data.currencies.filter(
      (currency) => !favoriteCurrencies().some((favorite) => favorite.code === currency.code)
    )

  const favoriteCurrency = useFavoriteCurrency({
    onSuccess: () => {
      toast.success("Added to favorites")
    }
  })
  const unfavoriteCurrency = useUnfavoriteCurrency({
    onSuccess: () => {
      toast.success("Removed from favorites")
    }
  })
  const setDefaultCurrency = useSetDefaultCurrency({
    onSuccess: () => {
      toast.success("Set as default")
    }
  })

  return (
    <div class="flex flex-col">
      <div class="mb-6 flex items-center bg-white px-4 py-2 shadow-sm">
        <div class="min-w-0 flex-1">
          <div class="text-xs text-gray-600">Default currency</div>
          <div class="mb-1 truncate leading-none">
            {defaultCurrency()?.code} ({defaultCurrency()?.name})
          </div>
        </div>
      </div>

      <Show when={favoriteCurrencies().length === 0}>
        <div class="text-center italic">No favourite currencies</div>
      </Show>

      <For each={favoriteCurrencies()}>
        {(currency) => (
          <Currency
            currency={currency}
            isFavorite={true}
            onFavorite={() => unfavoriteCurrency({ code: currency.code })}
            onSetDefault={() => setDefaultCurrency({ code: currency.code })}
          />
        )}
      </For>

      <div class="mb-6" />

      <For each={otherCurrencies()}>
        {(currency) => (
          <Currency
            currency={currency}
            isFavorite={false}
            onFavorite={() => favoriteCurrency({ code: currency.code })}
            onSetDefault={() => setDefaultCurrency({ code: currency.code })}
          />
        )}
      </For>
    </div>
  )
}

const Currency: Component<{
  currency: FullCurrencyFragment
  isFavorite: boolean
  onFavorite: () => void
  onSetDefault: () => void
}> = (props) => {
  return (
    <div class="flex items-center bg-white px-4 py-2 shadow-sm">
      <div class="mr-4 min-w-0 flex-1">
        <h3 class="mb-1 truncate leading-none">
          {props.currency.code} ({props.currency.name})
        </h3>
      </div>

      <Button
        variant="ghost"
        colorScheme={props.isFavorite ? "primary" : "neutral"}
        size="sm"
        onClick={props.onFavorite}
        class="mr-2"
      >
        <TbStar />
      </Button>

      <Button variant="ghost" colorScheme="neutral" size="sm" onClick={props.onSetDefault}>
        <span class="text-xs">Set default</span>
      </Button>
    </div>
  )
}
