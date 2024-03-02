import { IconStar, IconStarFilled } from "@tabler/icons-solidjs"
import { Component, For, Show } from "solid-js"
import toast from "solid-toast"
import { CurrenciesQuery, CurrentUserQuery, FullCurrencyFragment } from "../../graphql-types"
import { useFavouriteCurrency } from "../../graphql/mutations/favouriteCurrency"
import { useSetDefaultCurrency } from "../../graphql/mutations/setDefaultCurrency"
import { useUnfavouriteCurrency } from "../../graphql/mutations/unfavouriteCurrency"
import { Button } from "../base/Button"

export const CurrenciesList: Component<{
  data: CurrenciesQuery
  currentUser?: CurrentUserQuery
}> = (props) => {
  const defaultCurrency = () => props.currentUser?.currentUser?.defaultCurrency
  const favouriteCurrencies = () => props.currentUser?.currentUser?.favouriteCurrencies || []
  const otherCurrencies = () =>
    props.data.currencies.filter(
      (currency) => !favouriteCurrencies().some((favourite) => favourite.code === currency.code)
    )

  const favouriteCurrency = useFavouriteCurrency({
    onSuccess: () => {
      toast.success("Added to favourites")
    }
  })
  const unfavouriteCurrency = useUnfavouriteCurrency({
    onSuccess: () => {
      toast.success("Removed from favourites")
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

      <Show when={favouriteCurrencies().length === 0}>
        <div class="text-center italic">No favourite currencies</div>
      </Show>

      <For each={favouriteCurrencies()}>
        {(currency) => (
          <Currency
            currency={currency}
            isFavorite={true}
            onFavorite={() => unfavouriteCurrency({ id: currency.id })}
            onSetDefault={() => setDefaultCurrency({ id: currency.id })}
          />
        )}
      </For>

      <div class="mb-6" />

      <For each={otherCurrencies()}>
        {(currency) => (
          <Currency
            currency={currency}
            isFavorite={false}
            onFavorite={() => favouriteCurrency({ id: currency.id })}
            onSetDefault={() => setDefaultCurrency({ id: currency.id })}
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
        {props.isFavorite ? <IconStarFilled /> : <IconStar />}
      </Button>

      <Button variant="ghost" colorScheme="neutral" size="sm" onClick={props.onSetDefault}>
        <span class="text-xs">Set default</span>
      </Button>
    </div>
  )
}
