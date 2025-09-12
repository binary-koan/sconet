import { repeat, uniqueId } from "lodash"
import { IconSelector } from "@tabler/icons-solidjs"
import { Component, createSignal, onMount } from "solid-js"
import toast from "solid-toast"
import { FullTransactionFragment } from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery"
import { Button } from "../base/Button"
import { InputAddon, InputGroup, InputGroupInput } from "../base/InputGroup"
import { CurrencySelect } from "../currencies/CurrencySelect"
import ConfirmCancelButtons from "./ConfirmCancelButtons"

export function toCents(amount: string, currency?: { decimalDigits: number }) {
  return Math.round(
    parseFloat(amount.replaceAll(",", "") || "0") * 10 ** (currency?.decimalDigits || 0)
  )
}

export const AmountEditor: Component<{
  transaction: FullTransactionFragment
  field?: "amount" | "shopAmount"
  stopEditing: () => void
}> = (props) => {
  const currencies = useCurrenciesQuery()
  const id = uniqueId("amount-editor-")

  const updateTransaction = useUpdateTransaction({
    onSuccess() {
      toast.success("Amount updated")
      props.stopEditing()
    }
  })
  const [newAmount, setNewAmount] = createSignal(
    Math.abs(
      // eslint-disable-next-line solid/reactivity
      (props.field === "shopAmount"
        ? // eslint-disable-next-line solid/reactivity
          props.transaction.shopAmount?.amountDecimal
        : // eslint-disable-next-line solid/reactivity
          props.transaction.amount?.amountDecimal) || 0
    ).toString()
  )
  const [newCurrencyId, setNewCurrencyId] = createSignal(
    // eslint-disable-next-line solid/reactivity
    props.field === "shopAmount"
      ? // eslint-disable-next-line solid/reactivity
        props.transaction.shopCurrency?.id || null
      : // eslint-disable-next-line solid/reactivity
        null
  )

  const doUpdate = async () => {
    if (props.field === "shopAmount" && !newCurrencyId()) {
      toast.error("Please select a currency")
      return
    }

    let currency = props.transaction.currency!

    if (props.field === "shopAmount") {
      currency =
        currencies()?.currencies.find((currency) => currency.code === newCurrencyId()) || currency
    }

    let amount = toCents(newAmount(), currency)

    if (
      (props.transaction.amount && props.transaction.amount.amountDecimal <= 0) ||
      (props.transaction.shopAmount && props.transaction.shopAmount.amountDecimal <= 0)
    ) {
      amount = -amount
    }

    const input =
      props.field === "shopAmount"
        ? { shopAmountCents: amount, shopCurrencyId: newCurrencyId() }
        : { amountCents: amount }

    await updateTransaction({
      id: props.transaction.id,
      input
    })
  }

  let input: HTMLInputElement | undefined

  onMount(() => {
    input?.focus()
  })

  return (
    <div class="flex">
      <label class="sr-only" for={id}>
        Edit amount
      </label>
      <InputGroup class="flex-1">
        <InputAddon>
          {props.field === "shopAmount" ? (
            <CurrencySelect
              value={newCurrencyId()}
              onChange={setNewCurrencyId}
              filter={(currency) => currency.code !== props.transaction.currency?.id}
            >
              {(currency) => (
                <Button size="xs">
                  <span class="flex-1 text-left">{currency?.code || "..."}</span>
                  <IconSelector class="ml-1" />
                </Button>
              )}
            </CurrencySelect>
          ) : (
            props.transaction.currency?.symbol
          )}
        </InputAddon>
        <InputGroupInput
          ref={input}
          id={id}
          inputmode="decimal"
          value={newAmount()}
          step={
            props.transaction.currency && props.transaction.currency.decimalDigits > 0
              ? `0.${repeat("0", props.transaction.currency.decimalDigits - 1)}1`
              : "1"
          }
          onChange={(e) => setNewAmount(e.currentTarget.value)}
        />
      </InputGroup>
      <ConfirmCancelButtons onConfirm={doUpdate} onCancel={props.stopEditing} />
    </div>
  )
}
