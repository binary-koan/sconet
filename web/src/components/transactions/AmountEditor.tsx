import { Component, createSignal, onMount } from "solid-js"
import { FullTransactionFragment } from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { Input } from "../base/Input"
import ConfirmCancelButtons from "./ConfirmCancelButtons"

const MemoEditor: Component<{ transaction: FullTransactionFragment; stopEditing: () => void }> = (
  props
) => {
  const updateTransaction = useUpdateTransaction({
    onSuccess() {
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
        onChange={(e) => setNewMemo(e.currentTarget.value)}
        class="flex-1"
      />
      <ConfirmCancelButtons onConfirm={doUpdate} onCancel={props.stopEditing} />
    </div>
  )
}

export default MemoEditor
