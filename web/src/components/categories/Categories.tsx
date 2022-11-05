import { Box, Button, Text } from "@hope-ui/solid"
import { Link } from "@solidjs/router"
import { orderBy, isEqual, debounce } from "lodash"
import { Component, createEffect, createSignal, For, Show } from "solid-js"
import { CategoriesQuery, FullCategoryFragment } from "../../graphql-types"
import { useMutation } from "../../graphqlClient"
import CategoryIndicator from "../CategoryIndicator"
import {
  closestCenter,
  createSortable,
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  DragOverlay,
  SortableProvider,
  transformStyle
} from "@thisbeyond/solid-dnd"
import { TbArrowsSort, TbEdit, TbTrash } from "solid-icons/tb"
import { namedIcons } from "../../utils/namedIcons"
import toast from "solid-toast"
import { Dynamic } from "solid-js/web"
import { gql } from "../../utils/gql"
import { useDeleteCategory } from "../../graphql/mutations/deleteCategoryMutation"
import { useReorderCategories } from "../../graphql/mutations/reorderCategoriesMutation"

const DragDropProviderFixed = DragDropProvider as any
const SortableProviderFixed = SortableProvider as any
const DragOverlayFixed = DragOverlay as any

const CategoriesList: Component<{ data: CategoriesQuery }> = (props) => {
  const [deleteCategory] = useDeleteCategory({
    onSuccess: () => toast.success("Category deleted"),
    onError: (error: any) => toast.error(error.message)
  })

  const [reorderCategories] = useReorderCategories({
    onSuccess: () => toast.success("Categories reordered"),
    onError: (error) => toast.error(error.message)
  })

  const onDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete category " + id + "?")) {
      deleteCategory({ id })
    }
  }

  const [orderedCategories, setOrderedCategories] = createSignal<FullCategoryFragment[]>([])
  const [draggingItem, setDraggingItem] = createSignal<FullCategoryFragment | null>(null)

  const ids = () => orderedCategories().map((category) => category.id)

  const doReorder = debounce(() => {
    if (
      !isEqual(
        orderedCategories().map((category) => category.id),
        props.data.categories.map((category) => category.id)
      )
    ) {
      reorderCategories({
        orderedIds: orderedCategories().map((category) => category.id)
      })
    }
  }, 1000)

  const onDragStart: DragEventHandler = ({ draggable }) => {
    setDraggingItem(
      orderedCategories().find((category) => category.id === (draggable.id as string))!
    )
  }

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = ids()
      const fromIndex = currentItems.indexOf(draggable.id as string)
      const toIndex = currentItems.indexOf(droppable.id as string)

      if (fromIndex !== toIndex) {
        const updatedItems = [...orderedCategories()]
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1))
        setOrderedCategories(updatedItems)
        doReorder()
      }
    }
    setDraggingItem(null)
  }

  createEffect(() => {
    setOrderedCategories(orderBy(props.data.categories, (category) => category.sortOrder))
  })

  return (
    <DragDropProviderFixed
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetector={closestCenter}
    >
      <DragDropSensors />
      <SortableProviderFixed ids={ids()}>
        <For each={orderedCategories()}>
          {(category) => <SortableCategory category={category} onDeleteClick={onDeleteClick} />}
        </For>
      </SortableProviderFixed>

      <DragOverlayFixed>
        <Show when={draggingItem()}>
          <Category category={draggingItem()!} onDeleteClick={() => {}} />
        </Show>
      </DragOverlayFixed>
    </DragDropProviderFixed>
  )
}

const SortableCategory: Component<{
  category: CategoriesQuery["categories"][number]
  onDeleteClick: (id: string) => void
}> = (props) => {
  const sortable = createSortable(props.category.id)

  return (
    <div
      ref={sortable.ref}
      style={{
        ...transformStyle(sortable.transform),
        opacity: sortable.isActiveDraggable ? "0.25" : "1"
      }}
    >
      <Category sortable={sortable} {...props} />
    </div>
  )
}

const Category: Component<{
  category: CategoriesQuery["categories"][number]
  onDeleteClick: (id: string) => void
  sortable?: ReturnType<typeof createSortable>
}> = (props) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      paddingStart="$4"
      paddingEnd="$4"
      paddingTop="$2"
      paddingBottom="$2"
      backgroundColor="$neutral1"
      boxShadow="$xs"
    >
      <Box marginRight="$2" cursor="move" color="$neutral8">
        <Dynamic component={TbArrowsSort} {...props.sortable?.dragActivators} />
      </Box>
      <CategoryIndicator
        size="$10"
        iconSize="1.5em"
        icon={namedIcons[props.category.icon]}
        color={props.category.color}
        includeInReports={true}
      />
      <Box minWidth="0" marginStart="$4" marginEnd="$4" flex="1">
        <Text noOfLines={1} lineHeight="1" paddingBottom="$1">
          {props.category.name}
        </Text>
        <Text noOfLines={1} lineHeight="1" fontSize="$xs" color="gray.400">
          {props.category.budget ? `Budget: ${props.category.budget.formatted}` : "No budget"}
        </Text>
      </Box>
      <Button
        as={Link}
        href={`/categories/${props.category.id}`}
        size="sm"
        marginStart="auto"
        marginEnd="$2"
        title={"Edit category " + props.category.id}
      >
        <Dynamic component={TbEdit} />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        colorScheme="danger"
        title={"Delete category " + props.category.id}
        onClick={() => props.onDeleteClick(props.category.id)}
      >
        <Dynamic component={TbTrash} />
      </Button>
    </Box>
  )
}

export default CategoriesList
