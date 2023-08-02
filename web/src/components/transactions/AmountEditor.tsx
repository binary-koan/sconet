import { repeat, uniqueId } from "lodash"
import { Component, createSignal, onMount } from "solid-js"
import toast from "solid-toast"
import { FullTransactionFragment } from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { showAlert } from "../AlertManager"
import { InputAddon, InputGroup, InputGroupInput } from "../base/InputGroup"
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

  const doUpdate = async () => {
    let confirmed = true

    if (props.transaction.splitTo.length > 0) {
      confirmed = await showAlert({
        title: "Split transactions will be deleted",
        body: "Changing the amount will delete split transactions. Are you sure?"
      })
    }

    if (confirmed) {
      let amount = Math.round(
        parseFloat(newAmount()) * 10 ** props.transaction.currency.decimalDigits
      )

      if (
        (props.transaction.amount && props.transaction.amount.decimalAmount < 0) ||
        (props.transaction.originalAmount && props.transaction.originalAmount.decimalAmount < 0)
      ) {
        amount = -amount
      }

      const input = props.field === "originalAmount" ? { originalAmount: amount } : { amount }

      await updateTransaction({
        id: props.transaction.id,
        input
      })
    }
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
        <InputAddon>{props.transaction.currency.symbol}</InputAddon>
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
