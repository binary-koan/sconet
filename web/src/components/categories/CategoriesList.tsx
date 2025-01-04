import { debounce } from "@solid-primitives/scheduled"
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
import { isEqual, noop, orderBy } from "lodash"
import { IconArchive, IconArrowsSort, IconEdit, IconTrash } from "@tabler/icons-solidjs"
import { Component, createEffect, createSignal, For, Show } from "solid-js"
import toast from "solid-toast"
import { CategoriesQuery, FullCategoryFragment } from "../../graphql-types.ts"
import { useDeleteCategory } from "../../graphql/mutations/deleteCategoryMutation.ts"
import { useArchiveCategory } from "~/graphql/mutations/archiveCategoryMutation.ts"
import { useReorderCategories } from "../../graphql/mutations/reorderCategoriesMutation.ts"
import { namedIcons } from "../../utils/namedIcons.ts"
import { Button, LinkButton } from "../base/Button.tsx"
import CategoryIndicator from "../CategoryIndicator.tsx"

const DragDropProviderFixed = DragDropProvider as any
const SortableProviderFixed = SortableProvider as any
const DragOverlayFixed = DragOverlay as any

export const CategoriesList: Component<{ data: CategoriesQuery }> = (props) => {
  const deleteCategory = useDeleteCategory({
    onSuccess: () => toast.success("Category deleted")
  })

  const archiveCategory = useArchiveCategory({
    onSuccess: () => toast.success("Category archived")
  })

  const reorderCategories = useReorderCategories({
    onSuccess: () => toast.success("Categories reordered")
  })

  const onDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete category " + id + "?")) {
      deleteCategory({ id })
    }
  }

  const onArchiveClick = (id: string) => {
    if (confirm("Are you sure you want to archive category " + id + "?")) {
      archiveCategory({ id })
    }
  }

  const [orderedCategories, setOrderedCategories] = createSignal<FullCategoryFragment[]>([])
  const [draggingItem, setDraggingItem] = createSignal<FullCategoryFragment | null>(null)

  const ids = () => orderedCategories().map((category) => category.id)

  // eslint-disable-next-line solid/reactivity
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
    <div class="flex flex-col gap-px bg-gray-100 shadow-sm">
      <DragDropProviderFixed
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        collisionDetector={closestCenter}
      >
        <DragDropSensors />
        <SortableProviderFixed ids={ids()}>
          <For each={orderedCategories()}>
            {(category) => (
              <SortableCategory
                category={category}
                onDeleteClick={onDeleteClick}
                onArchiveClick={onArchiveClick}
              />
            )}
          </For>
        </SortableProviderFixed>

        <DragOverlayFixed>
          <Show when={draggingItem()}>
            <Category category={draggingItem()!} onDeleteClick={noop} />
          </Show>
        </DragOverlayFixed>
      </DragDropProviderFixed>
    </div>
  )
}

const SortableCategory: Component<{
  category: CategoriesQuery["categories"][number]
  onDeleteClick: (id: string) => void
  onArchiveClick: (id: string) => void
}> = (props) => {
  // eslint-disable-next-line solid/reactivity
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
  onArchiveClick: (id: string) => void
  sortable?: ReturnType<typeof createSortable>
}> = (props) => {
  return (
    <div class="flex items-center bg-white px-4 py-2 shadow-sm">
      <div class="mr-2 hidden cursor-move text-gray-600 md:block">
        <IconArrowsSort {...props.sortable?.dragActivators} />
      </div>
      <CategoryIndicator
        class="h-8 w-8"
        iconSize="1.5em"
        icon={namedIcons[props.category.icon]}
        color={props.category.color}
        includeInReports={true}
      />
      <div class="me-4 ml-4 min-w-0 flex-1">
        <h3 class="mb-1 truncate leading-none">{props.category.name}</h3>
        <p class="truncate text-xs leading-tight text-gray-600">
          {props.category.budget
            ? `Budget: ${props.category.budget.budget.formatted}`
            : "No budget"}
        </p>
      </div>
      <LinkButton
        href={`/categories/${props.category.id}`}
        size="sm"
        variant="ghost"
        class="ml-auto mr-2"
        title={"Edit category " + props.category.id}
      >
        <IconEdit />
      </LinkButton>
      {props.category.hasTransactions ? (
        <Button
          size="sm"
          variant="ghost"
          title={"Archive category " + props.category.id}
          onClick={() => props.onArchiveClick(props.category.id)}
        >
          <IconArchive />
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          colorScheme="danger"
          title={"Delete category " + props.category.id}
          onClick={() => props.onDeleteClick(props.category.id)}
        >
          <IconTrash />
        </Button>
      )}
    </div>
  )
}
