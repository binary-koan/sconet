import { uniqueId } from "lodash"
import { Component, createSignal, onMount } from "solid-js"
import toast from "solid-toast"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation.ts"
import { Input } from "../base/Input.tsx"
import ConfirmCancelButtons from "./ConfirmCancelButtons.tsx"

export const MemoEditor: Component<{
  class?: string
  transaction: { id: string; memo: string }
  stopEditing: () => void
}> = (props) => {
  const id = uniqueId("memo-editor-")

  const updateTransaction = useUpdateTransaction({
    onSuccess() {
      toast.success("Memo updated")
      props.stopEditing()
    }
  })
  // eslint-disable-next-line solid/reactivity
  const [newMemo, setNewMemo] = createSignal(props.transaction.memo)

  const doUpdate = async () => {
    await updateTransaction({
      id: props.transaction.id,
      input: { memo: newMemo() }
    })
  }

  let input: HTMLInputElement | undefined

  onMount(() => {
    input?.focus()
  })

  return (
    <div class={`flex ${props.class}`}>
      <label class="sr-only" for={id}>
        Edit memo
      </label>
      <Input
        ref={input}
        id={id}
        value={newMemo()}
        onInput={(e) => setNewMemo(e.currentTarget.value)}
        onEnter={doUpdate}
        onEscape={props.stopEditing}
        class="min-w-0 flex-1"
      />
      <ConfirmCancelButtons onConfirm={doUpdate} onCancel={props.stopEditing} />
    </div>
  )
}
