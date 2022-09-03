import { Box, Icon } from "@hope-ui/solid"
import { TbCaretDown } from "solid-icons/tb"
import { Component, createEffect, createSignal, Show } from "solid-js"
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
      <Box position="relative" onClick={() => props.isEditing && setModalOpen(true)}>
        <CategoryIndicator
          size={props.hasParent ? "8" : "10"}
          iconSize="lg"
          icon={props.category?.icon}
          color={props.category?.color}
          isSplit={props.hasChildren}
          includeInReports={props.includeInReports}
          isIncome={props.isIncome}
        />
        <Show when={props.isEditing && props.includeInReports && !props.hasChildren}>
          <CategoryEditIndicator category={props.category} />
        </Show>
      </Box>

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

const CategoryEditIndicator: Component<{ category: any }> = (props) => {
  const color = () => (props.category ? `$${props.category.color}8` : "$danger8")

  return (
    <Box
      position="absolute"
      bottom="-1"
      right="-1"
      width="6"
      height="6"
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor="$neutral1"
      border="2px"
      borderColor={color()}
      borderRadius="$full"
      color={color()}
    >
      <Icon as={TbCaretDown} />
    </Box>
  )
}

export default RelationEditInput
