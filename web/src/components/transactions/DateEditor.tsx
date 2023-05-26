import { Component, createSignal, onMount } from "solid-js"
import toast from "solid-toast"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { Input } from "../base/Input"
import ConfirmCancelButtons from "./ConfirmCancelButtons"

export const DateEditor: Component<{
  class?: string
  transaction: { id: string; date: string }
  stopEditing: () => void
}> = (props) => {
  const updateTransaction = useUpdateTransaction({
    onSuccess() {
      toast.success("Date updated")
      props.stopEditing()
    }
  })
  const [newDate, setNewDate] = createSignal(props.transaction.date)

  const doUpdate = async () => {
    await updateTransaction({
      id: props.transaction.id,
      input: { date: newDate() }
    })
  }

  let input: HTMLInputElement | undefined

  onMount(() => {
    input?.focus()
  })

  return (
    <div class={`flex ${props.class}`}>
      <Input
        ref={input}
        type="date"
        value={newDate()}
        onInput={(e) => setNewDate(e.currentTarget.value)}
        onEnter={doUpdate}
        onEscape={props.stopEditing}
        class="min-w-0 flex-1"
      />
      <ConfirmCancelButtons onConfirm={doUpdate} onCancel={props.stopEditing} />
    </div>
  )
}
