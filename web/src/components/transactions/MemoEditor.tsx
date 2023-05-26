import { Component, createSignal, onMount } from "solid-js"
import toast from "solid-toast"
import { FullTransactionFragment } from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { Input } from "../base/Input"
import ConfirmCancelButtons from "./ConfirmCancelButtons"

const MemoEditor: Component<{ transaction: FullTransactionFragment; stopEditing: () => void }> = (
  props
) => {
  const updateTransaction = useUpdateTransaction({
    onSuccess() {
      toast.success("Memo updated")
      props.stopEditing()
    }
  })
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
    <div class="flex">
      <Input
        ref={input}
        value={newMemo()}
        onInput={(e) => setNewMemo(e.currentTarget.value)}
        onEnter={doUpdate}
        onEscape={props.stopEditing}
        class="flex-1"
      />
      <ConfirmCancelButtons onConfirm={doUpdate} onCancel={props.stopEditing} />
    </div>
  )
}

export default MemoEditor
