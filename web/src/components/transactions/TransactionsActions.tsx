import { useNavigate } from "@solidjs/router"
import { IconCalendarEvent, IconFilter, IconList, IconPlus } from "@tabler/icons-solidjs"
import { Component, Show, createSignal } from "solid-js"
import { NewTransactionModal } from "./NewTransactionModal"

const BUTTON_CLASS =
  "flex items-center justify-center gap-1 rounded-full border border-border bg-card px-3 h-10 hover:bg-accent"

export const TransactionsActions: Component<{
  view: "list" | "calendar"
  filterCount?: number
  onFilter: () => void
}> = (props) => {
  const navigate = useNavigate()
  const [creatingTransaction, setCreatingTransaction] = createSignal(false)

  return (
    <>
      <div class="fixed bottom-[calc(66px+0.75rem+env(safe-area-inset-bottom))] right-3 z-[1025] flex items-center gap-2 md:bottom-6 md:right-6">
        <button
          type="button"
          class={`${BUTTON_CLASS} px-4 shadow-sm text-primary`}
          onClick={() => setCreatingTransaction(true)}
        >
          <IconPlus size="1.25em" class="-ml-1" />
          Add
        </button>
        <div class="flex rounded-full shadow-sm">
          <button
            type="button"
            class={`${BUTTON_CLASS} rounded-r-none border-r-0 text-muted-foreground`}
            classList={{ "!bg-indigo-600 !text-white": Boolean(props.filterCount) }}
            aria-label="Filter"
            onClick={() => props.onFilter()}
          >
            <IconFilter size="1.25em" />
            {props.filterCount ? `(${props.filterCount})` : ""}
          </button>
          <button
            type="button"
            class={`${BUTTON_CLASS} rounded-l-none text-muted-foreground`}
            aria-label={props.view === "list" ? "Calendar view" : "List view"}
            onClick={() =>
              navigate(props.view === "list" ? "/transactions/calendar" : "/transactions/list")
            }
          >
            <Show when={props.view === "list"} fallback={<IconList size="1.25em" />}>
              <IconCalendarEvent size="1.25em" />
            </Show>
          </button>
        </div>
      </div>

      <Show when={creatingTransaction()}>
        <NewTransactionModal isOpen={true} onClose={() => setCreatingTransaction(false)} />
      </Show>
    </>
  )
}
