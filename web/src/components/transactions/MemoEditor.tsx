import { InputGroup, Input } from "@hope-ui/solid"
import { Component, createSignal } from "solid-js"
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
      <Input
        flex="1"
        paddingEnd="24"
        value={newMemo()}
        onChange={(e) => setNewMemo(e.currentTarget.value)}
      />
      <ConfirmCancelButtons onConfirm={() => {}} onCancel={props.stopEditing} />
    </InputGroup>
  )
}

export default MemoEditor