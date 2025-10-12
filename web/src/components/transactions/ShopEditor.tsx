import { uniqueId } from "lodash"
import { Component, createSignal, onMount } from "solid-js"
import toast from "solid-toast"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { Input } from "../base/Input"
import ConfirmCancelButtons from "./ConfirmCancelButtons"

export const ShopEditor: Component<{
  class?: string
  transaction: { id: string; shop: string }
  stopEditing: () => void
}> = (props) => {
  const id = uniqueId("shop-editor-")

  const updateTransaction = useUpdateTransaction({
    onSuccess() {
      toast.success("Shop updated")
      props.stopEditing()
    }
  })
  // eslint-disable-next-line solid/reactivity
  const [newShop, setNewShop] = createSignal(props.transaction.shop)

  const doUpdate = async () => {
    await updateTransaction({
      id: props.transaction.id,
      input: { shop: newShop() }
    })
  }

  let input: HTMLInputElement | undefined

  onMount(() => {
    input?.focus()
  })

  return (
    <div class={`flex ${props.class}`}>
      <label class="sr-only" for={id}>
        Edit shop
      </label>
      <Input
        ref={input}
        id={id}
        value={newShop()}
        onInput={(e) => setNewShop(e.currentTarget.value)}
        onEnter={doUpdate}
        onEscape={props.stopEditing}
        class="min-w-0 flex-1"
      />
      <ConfirmCancelButtons onConfirm={doUpdate} onCancel={props.stopEditing} />
    </div>
  )
}
