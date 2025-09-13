import {
  IconArchive,
  IconAsterisk,
  IconArrowsSort,
  IconEdit,
  IconStar,
  IconStarFilled,
  IconTrash
} from "@tabler/icons-solidjs"
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
import { Component, For, Show, createEffect, createSignal } from "solid-js"
import toast from "solid-toast"
import { AccountsQuery, CurrentUserQuery } from "../../graphql-types"
import { useArchiveAccount } from "../../graphql/mutations/archiveAccountMutation"
import { useDeleteAccount } from "../../graphql/mutations/deleteAccountMutation"
import { useSetDefaultAccount } from "../../graphql/mutations/setDefaultAccount"
import { useFavouriteAccount } from "../../graphql/mutations/favouriteAccount"
import { useUnfavouriteAccount } from "../../graphql/mutations/unfavouriteAccount"
import { useReorderAccounts } from "../../graphql/mutations/reorderAccountsMutation"
import { Button, LinkButton } from "../base/Button"

const DragDropProviderFixed = DragDropProvider as any
const SortableProviderFixed = SortableProvider as any
const DragOverlayFixed = DragOverlay as any

const AccountsList: Component<{
  data: AccountsQuery
  currentUser?: CurrentUserQuery
}> = (props) => {
  const deleteAccount = useDeleteAccount({
    onSuccess: () => toast.success("Account deleted")
  })

  const archiveAccount = useArchiveAccount({
    onSuccess: () => toast.success("Account archived")
  })

  const onDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete account " + id + "?")) {
      deleteAccount({ id })
    }
  }

  const onArchiveClick = (id: string) => {
    if (confirm("Are you sure you want to archive account " + id + "?")) {
      archiveAccount({ id })
    }
  }

  const setDefaultAccount = useSetDefaultAccount({
    onSuccess: () => toast.success("Default account updated")
  })

  const favouriteAccount = useFavouriteAccount({
    onSuccess: () => toast.success("Added to favourites")
  })
  const unfavouriteAccount = useUnfavouriteAccount({
    onSuccess: () => toast.success("Removed from favourites")
  })

  const defaultAccountId = () => props.currentUser?.currentUser?.defaultAccount?.id

  const reorderAccounts = useReorderAccounts({
    onSuccess: () => toast.success("Accounts reordered")
  })

  const [orderedAccounts, setOrderedAccounts] = createSignal<AccountsQuery["accounts"]>([])
  const [draggingItem, setDraggingItem] = createSignal<AccountsQuery["accounts"][number] | null>(
    null
  )

  const ids = () => orderedAccounts().map((account) => account.id)

  // eslint-disable-next-line solid/reactivity
  const doReorder = debounce(() => {
    if (
      !isEqual(
        orderedAccounts().map((a) => a.id),
        props.data.accounts.map((a) => a.id)
      )
    ) {
      reorderAccounts({
        orderedIds: orderedAccounts().map((a) => a.id)
      })
    }
  }, 1000)

  const onDragStart: DragEventHandler = ({ draggable }) => {
    setDraggingItem(orderedAccounts().find((a) => a.id === (draggable.id as string))!)
  }

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = ids()
      const fromIndex = currentItems.indexOf(draggable.id as string)
      const toIndex = currentItems.indexOf(droppable.id as string)

      if (fromIndex !== toIndex) {
        const updatedItems = [...orderedAccounts()]
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1))
        setOrderedAccounts(updatedItems)
        doReorder()
      }
    }
    setDraggingItem(null)
  }

  createEffect(() => {
    setOrderedAccounts(orderBy(props.data.accounts, (a) => a.sortOrder))
  })

  return (
    <div class="shadow-xs flex flex-col gap-px bg-gray-100">
      <DragDropProviderFixed
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        collisionDetector={closestCenter}
      >
        <DragDropSensors />
        <SortableProviderFixed ids={ids()}>
          <For each={orderedAccounts()}>
            {(account) => (
              <SortableAccount
                account={account}
                defaultAccountId={defaultAccountId()}
                onDeleteClick={onDeleteClick}
                onArchiveClick={onArchiveClick}
                onFavouriteToggle={() =>
                  account.favourite
                    ? unfavouriteAccount({ id: account.id })
                    : favouriteAccount({ id: account.id })
                }
                onSetDefault={() => setDefaultAccount({ id: account.id })}
              />
            )}
          </For>
        </SortableProviderFixed>

        <DragOverlayFixed>
          <Show when={draggingItem()}>
            <AccountRow
              account={draggingItem()!}
              defaultAccountId={defaultAccountId()}
              onDeleteClick={() => {}}
              onArchiveClick={() => {}}
              onFavouriteToggle={noop}
              onSetDefault={noop}
            />
          </Show>
        </DragOverlayFixed>
      </DragDropProviderFixed>
    </div>
  )
}

export default AccountsList

const SortableAccount: Component<{
  account: AccountsQuery["accounts"][number]
  defaultAccountId?: string
  onDeleteClick: (id: string) => void
  onArchiveClick: (id: string) => void
  onFavouriteToggle: () => void
  onSetDefault: () => void
}> = (props) => {
  // eslint-disable-next-line solid/reactivity
  const sortable = createSortable(props.account.id)

  return (
    <div
      ref={sortable.ref}
      style={{
        ...transformStyle(sortable.transform),
        opacity: sortable.isActiveDraggable ? "0.25" : "1"
      }}
    >
      <AccountRow sortable={sortable} {...props} />
    </div>
  )
}

const AccountRow: Component<{
  account: AccountsQuery["accounts"][number]
  defaultAccountId?: string
  onDeleteClick: (id: string) => void
  onArchiveClick: (id: string) => void
  onFavouriteToggle: () => void
  onSetDefault: () => void
  sortable?: ReturnType<typeof createSortable>
}> = (props) => {
  return (
    <div class="shadow-xs flex items-center bg-white px-4 py-2">
      <div class="mr-2 hidden cursor-move text-gray-600 md:block">
        <IconArrowsSort {...props.sortable?.dragActivators} />
      </div>
      <div class="mr-4 min-w-0 flex-1">
        <h3 class="mb-1 truncate leading-none">{props.account.name}</h3>
        <p class="text-xs leading-tight text-gray-600">{props.account.currency.code}</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        colorScheme={props.account.favourite ? "primary" : "neutral"}
        class="ml-auto mr-2"
        title={(props.account.favourite ? "Unfavourite " : "Favourite ") + props.account.name}
        onClick={props.onFavouriteToggle}
      >
        {props.account.favourite ? <IconStarFilled /> : <IconStar />}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        colorScheme={props.account.id === props.defaultAccountId ? "primary" : "neutral"}
        class="ml-auto mr-2 gap-2 text-xs"
        title={"Set default to " + props.account.name}
        onClick={props.onSetDefault}
      >
        {props.account.id === props.defaultAccountId && "Default "}
        <IconAsterisk />
      </Button>
      <LinkButton
        href={`/accounts/${props.account.id}`}
        size="sm"
        variant="ghost"
        class="ml-auto mr-2"
        title={"Edit account " + props.account.name}
      >
        <IconEdit />
      </LinkButton>
      {props.account.hasTransactions ? (
        <Button
          size="sm"
          variant="ghost"
          title={"Archive account " + props.account.name}
          onClick={() => props.onArchiveClick(props.account.id)}
        >
          <IconArchive />
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          colorScheme="danger"
          title={"Delete account " + props.account.name}
          onClick={() => props.onDeleteClick(props.account.id)}
        >
          <IconTrash />
        </Button>
      )}
    </div>
  )
}
