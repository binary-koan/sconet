import { Component, createSignal } from "solid-js"
import { FullTransactionFragment } from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { InputGroup, InputGroupInput } from "../base/InputGroup"
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

  return (
    <InputGroup>
      <InputGroupInput
        autofocus
        value={newMemo()}
        onChange={(e) => setNewMemo(e.currentTarget.value)}
      />
      <ConfirmCancelButtons onConfirm={doUpdate} onCancel={props.stopEditing} />
    </InputGroup>
  )
}

export default MemoEditor
