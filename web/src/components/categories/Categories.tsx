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
import { debounce, isEqual, orderBy } from "lodash"
import { TbArrowsSort, TbEdit, TbTrash } from "solid-icons/tb"
import { Component, createEffect, createSignal, For, Show } from "solid-js"
import toast from "solid-toast"
import { CategoriesQuery, FullCategoryFragment } from "../../graphql-types"
import { useDeleteCategory } from "../../graphql/mutations/deleteCategoryMutation"
import { useReorderCategories } from "../../graphql/mutations/reorderCategoriesMutation"
import { namedIcons } from "../../utils/namedIcons"
import { Button, LinkButton } from "../base/Button"
import CategoryIndicator from "../CategoryIndicator"

const DragDropProviderFixed = DragDropProvider as any
const SortableProviderFixed = SortableProvider as any
const DragOverlayFixed = DragOverlay as any

const CategoriesList: Component<{ data: CategoriesQuery }> = (props) => {
  const deleteCategory = useDeleteCategory({
    onSuccess: () => toast.success("Category deleted"),
    onError: (error: any) => toast.error(error.message)
  })

  const reorderCategories = useReorderCategories({
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
    <div class="flex items-center bg-white px-4 py-2 shadow-sm">
      <div class="mr-2 cursor-move text-gray-600">
        <TbArrowsSort {...props.sortable?.dragActivators} />
      </div>
      <CategoryIndicator
        class="h-10 w-10"
        iconSize="1.5em"
        icon={namedIcons[props.category.icon]}
        color={props.category.color}
        includeInReports={true}
      />
      <div class="me-4 ml-4 min-w-0 flex-1">
        <h3 class="mb-1 truncate leading-none">{props.category.name}</h3>
        <p class="truncate text-xs leading-tight text-gray-600">
          {props.category.budget ? `Budget: ${props.category.budget.formatted}` : "No budget"}
        </p>
      </div>
      <LinkButton
        href={`/categories/${props.category.id}`}
        size="sm"
        variant="ghost"
        class="ml-auto mr-2"
        title={"Edit category " + props.category.id}
      >
        <TbEdit />
      </LinkButton>
      <Button
        size="sm"
        variant="ghost"
        colorScheme="danger"
        title={"Delete category " + props.category.id}
        onClick={() => props.onDeleteClick(props.category.id)}
      >
        <TbTrash />
      </Button>
    </div>
  )
}

export default CategoriesList
