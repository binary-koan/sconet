import { Component, For } from "solid-js"
import { CurrenciesQuery } from "../../graphql-types"

const Currencies: Component<{
  data: CurrenciesQuery
}> = (props) => {
  return (
    <For each={props.data.currencies}>
      {(currency) => (
        <div class="flex items-center bg-white px-4 py-2 shadow-sm">
          <div class="mr-4 min-w-0 flex-1">
            <h3 class="mb-1 truncate leading-none">
              {currency.code} ({currency.symbol})
            </h3>
          </div>
        </div>
      )}
    </For>
  )
}

export default Currencies
