import { Component, createSignal, Show } from "solid-js"
import { namedIcons } from "../../utils/namedIcons"
import CategoryIndicator from "../CategoryIndicator"
import RelationPickerModal from "./RelationPickerModal"

const RelationEditInput: Component<{
  hasParent: boolean
  isIncome: boolean
  category: any
  accountMailbox: any
  hasChildren: boolean
  includeInReports: boolean
  onChangeCategory: (category: any) => void
  onChangeAccountMailbox: (accountMailbox: any) => void
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
        <CategoryIndicator
          class={props.hasParent ? "h-8 w-8" : "h-10 w-10"}
          iconSize="1.25em"
          icon={props.category?.icon ? namedIcons[props.category?.icon] : undefined}
          color={props.category?.color}
          isSplit={props.hasChildren}
          includeInReports={props.includeInReports}
          isIncome={props.isIncome}
        />
      </div>

      <Show when={modalOpen()}>
        <RelationPickerModal
          isIncome={props.isIncome}
          categoryProps={{
            multiple: false,
            value: props.category,
            onChange: props.onChangeCategory
          }}
          accountMailboxProps={{
            value: props.accountMailbox,
            onChange: props.onChangeAccountMailbox
          }}
          isOpen={true}
          onClose={() => setModalOpen(false)}
        />
      </Show>
    </>
  )
}

export default RelationEditInput
