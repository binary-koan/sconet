import { IconTrash } from "@tabler/icons-solidjs"
import { Component, For, Show } from "solid-js"
import toast from "solid-toast"
import { FavouriteTransactionsQuery } from "../../graphql-types"
import { useFavouriteTransactionDelete } from "../../graphql/mutations/favouriteTransactionDelete"
import { Button } from "../base/Button"

export const FavouriteTransactionsList: Component<{
  data: FavouriteTransactionsQuery
}> = (props) => {
  const favourites = () => props.data.favouriteTransactions
  const del = useFavouriteTransactionDelete({
    onSuccess: () => toast.success("Favourite deleted")
  })

  return (
    <div class="flex flex-col px-2">
      <Show when={favourites().length === 0}>
        <div class="not-first:border-t-0 border border-gray-100 bg-white px-4 py-2 italic first:rounded-t-3xl last:rounded-b-3xl">
          No favourite transactions
        </div>
      </Show>
      <For each={favourites()}>
        {(fav) => (
          <div class="not-first:border-t-0 flex items-center justify-between border border-gray-100 bg-white px-4 py-2 first:rounded-t-3xl last:rounded-b-3xl">
            <div class="min-w-0">
              <div class="truncate font-medium">{fav.name}</div>
              <div class="truncate text-xs text-gray-600">
                {fav.shop}
                <Show when={fav.memo}>
                  {" • "}
                  {fav.memo}
                </Show>
                <Show when={fav.priceCents}>
                  {(priceCents) => ` • ${Math.abs(priceCents() / 100)}`}
                </Show>
                <Show when={fav.account}>{(account) => ` • ${account().name}`}</Show>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="danger"
              onClick={() => del({ id: fav.id })}
              loading={del.loading}
            >
              <IconTrash />
            </Button>
          </div>
        )}
      </For>
    </div>
  )
}
