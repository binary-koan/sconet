import { Component, For, Show } from "solid-js"
import { CurrentExchangeRatesQuery } from "../../graphql-types"

export const CurrentExchangeRates: Component<{
  data: CurrentExchangeRatesQuery
}> = (props) => {
  return (
    <div class="bg-white px-4 py-3 shadow-sm">
      <Show
        when={props.data.currentExchangeRates.length > 0}
        fallback="No exchange rates for today yet."
      >
        <div class="mb-3 text-sm font-semibold text-gray-700">
          On{" "}
          {new Date(props.data.currentExchangeRates[0].date).toLocaleDateString("default", {
            timeZone: "UTC"
          })}
          :
        </div>
        <For each={props.data.currentExchangeRates}>
          {(exchangeRate) => (
            <div class="font-mono">
              1 {exchangeRate.fromCurrency.code} = {exchangeRate.rate}{" "}
              {exchangeRate.toCurrency.code}
            </div>
          )}
        </For>
      </Show>
    </div>
  )
}
