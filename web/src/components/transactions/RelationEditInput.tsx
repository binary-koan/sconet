import { Component, createEffect, createSignal, Show } from "solid-js"
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
  isEditing: boolean
  onChangeCategory: (category: any) => void
  onChangeAccountMailbox: (accountMailbox: any) => void
}> = (props) => {
  const [modalOpen, setModalOpen] = createSignal(false)

  createEffect(() => {
    if (!props.isEditing) setModalOpen(false)
  })

  return (
    <>
      <div class="relative" onClick={() => props.isEditing && setModalOpen(true)}>
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

      <Show when={props.isEditing && modalOpen()}>
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
