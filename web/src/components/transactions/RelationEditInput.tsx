import { Component, createSignal, JSX, Show } from "solid-js"
import { AccountBasicDetails } from "./AccountPicker.tsx"
import { CategoryBasicDetails } from "./CategoryPicker.tsx"
import RelationPickerModal from "./RelationPickerModal.tsx"

const RelationEditInput: Component<{
  isIncome: boolean
  category?: CategoryBasicDetails
  account?: AccountBasicDetails
  showCategory: boolean
  showAccount: boolean
  onChangeCategory: (category: CategoryBasicDetails) => void
  onChangeAccount: (account: AccountBasicDetails) => void
  children: JSX.Element
}> = (props) => {
  const [modalOpen, setModalOpen] = createSignal(false)

  const onClick = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    setModalOpen(true)
  }

  return (
    <>
      <div class="relative" onClick={onClick}>
        {props.children}
      </div>

      <Show when={modalOpen()}>
        <RelationPickerModal
          isIncome={props.isIncome}
          categoryProps={
            props.showCategory
              ? {
                  multiple: false,
                  value: props.category,
                  onChange: (category) => {
                    props.onChangeCategory(category)
                    setModalOpen(false)
                  }
                }
              : undefined
          }
          accountProps={
            props.showAccount
              ? {
                  value: props.account,
                  onChange: (account) => {
                    props.onChangeAccount(account)
                    setModalOpen(false)
                  }
                }
              : undefined
          }
          isOpen={true}
          onClose={() => setModalOpen(false)}
        />
      </Show>
    </>
  )
}

export default RelationEditInput
