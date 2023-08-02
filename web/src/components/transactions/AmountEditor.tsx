import { repeat, uniqueId } from "lodash"
import { TbSelector } from "solid-icons/tb"
import { Component, createSignal, onMount } from "solid-js"
import toast from "solid-toast"
import { FullTransactionFragment } from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { Button } from "../base/Button"
import { InputAddon, InputGroup, InputGroupInput } from "../base/InputGroup"
import { CurrencySelect } from "../currencies/CurrencySelect"
import ConfirmCancelButtons from "./ConfirmCancelButtons"

export const AmountEditor: Component<{
  transaction: FullTransactionFragment
  field?: "amount" | "originalAmount"
  stopEditing: () => void
}> = (props) => {
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
      (props.field === "originalAmount"
        ? // eslint-disable-next-line solid/reactivity
          props.transaction.originalAmount?.decimalAmount
        : // eslint-disable-next-line solid/reactivity
          props.transaction.amount?.decimalAmount) || 0
    ).toString()
  )
  const [newCurrencyCode, setNewCurrencyCode] = createSignal(
    // eslint-disable-next-line solid/reactivity
    props.field === "originalAmount"
      ? // eslint-disable-next-line solid/reactivity
        props.transaction.originalCurrencyCode
      : // eslint-disable-next-line solid/reactivity
        null
  )

  const doUpdate = async () => {
    let amount = Math.round(
      parseFloat(newAmount()) * 10 ** props.transaction.currency.decimalDigits
    )

    if (
      (props.transaction.amount && props.transaction.amount.decimalAmount < 0) ||
      (props.transaction.originalAmount && props.transaction.originalAmount.decimalAmount < 0)
    ) {
      amount = -amount
    }

    const input =
      props.field === "originalAmount"
        ? { originalAmount: amount, originalCurrencyCode: newCurrencyCode() }
        : { amount }

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
          {props.field === "originalAmount" ? (
            <CurrencySelect
              value={newCurrencyCode()}
              onChange={setNewCurrencyCode}
              filter={(currency) => currency.code !== props.transaction.currency.code}
            >
              {(currency) => (
                <Button size="xs">
                  <span class="flex-1 text-left">{currency?.code || "..."}</span>
                  <TbSelector class="ml-1" />
                </Button>
              )}
            </CurrencySelect>
          ) : (
            props.transaction.currency.symbol
          )}
        </InputAddon>
        <InputGroupInput
          ref={input}
          id={id}
          type="number"
          value={newAmount()}
          step={
            props.transaction.currency.decimalDigits > 0
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
