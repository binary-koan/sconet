import { Component, createSignal } from "solid-js"
import { InputGroup, InputGroupInput } from "../base/InputGroup"
import ConfirmCancelButtons from "./ConfirmCancelButtons"

const MemoEditor: Component<{ transaction: any; stopEditing: () => void }> = (props) => {
  // const [updateTransaction] = useMutation(UPDATE_TRANSACTION_MUTATION)
  const [newMemo, setNewMemo] = createSignal(props.transaction.memo)

  // const doUpdate = async () => {
  //   await updateTransaction({
  //     variables: {
  //       id: transaction.id,
  //       input: { memo: newMemo },
  //     },
  //   })
  //   stopEditing()
  // }

  return (
    <InputGroup>
      <InputGroupInput value={newMemo()} onChange={(e) => setNewMemo(e.currentTarget.value)} />
      <ConfirmCancelButtons onConfirm={() => {}} onCancel={props.stopEditing} />
    </InputGroup>
  )
}

export default MemoEditor
