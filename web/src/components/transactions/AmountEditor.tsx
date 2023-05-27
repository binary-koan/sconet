import { repeat } from "lodash"
import { Component, createSignal, onMount } from "solid-js"
import toast from "solid-toast"
import { FullTransactionFragment } from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { showAlert } from "../AlertManager"
import { InputAddon, InputGroup, InputGroupInput } from "../base/InputGroup"
import ConfirmCancelButtons from "./ConfirmCancelButtons"

export const AmountEditor: Component<{
  transaction: FullTransactionFragment
  stopEditing: () => void
}> = (props) => {
  const updateTransaction = useUpdateTransaction({
    onSuccess() {
      toast.success("Amount updated")
      props.stopEditing()
    }
  })
  const [newAmount, setNewAmount] = createSignal(
    // eslint-disable-next-line solid/reactivity
    Math.abs(props.transaction.amount.decimalAmount).toString()
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

      if (props.transaction.amount.decimalAmount < 0) {
        amount = -amount
      }

      await updateTransaction({
        id: props.transaction.id,
        input: { amount }
      })
    }
  }

  let input: HTMLInputElement | undefined

  onMount(() => {
    input?.focus()
  })

  return (
    <div class="flex">
      <InputGroup class="flex-1">
        <InputAddon>{props.transaction.currency.symbol}</InputAddon>
        <InputGroupInput
          ref={input}
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
