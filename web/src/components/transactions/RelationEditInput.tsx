import { TbCaretDown } from "solid-icons/tb"
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
        <Show when={props.isEditing && props.includeInReports && !props.hasChildren}>
          <CategoryEditIndicator category={props.category} />
        </Show>
      </div>

      <Show when={props.isEditing}>
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
          isOpen={modalOpen()}
          onClose={() => setModalOpen(false)}
        />
      </Show>
    </>
  )
}

const CategoryEditIndicator: Component<{ category: any }> = () => {
  return (
    <div class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-600 bg-white text-gray-600">
      <TbCaretDown />
    </div>
  )
}

export default RelationEditInput
