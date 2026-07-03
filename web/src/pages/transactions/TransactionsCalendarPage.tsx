import { Title } from "@solidjs/meta"
import { useNavigate, useRouteData } from "@solidjs/router"
import { IconArrowLeft, IconArrowRight, IconList, IconPlus } from "@tabler/icons-solidjs"
import { Component, Show, createSignal, onMount } from "solid-js"
import { Cell } from "../../components/Cell"
import { Button } from "../../components/base/Button"
import { PageHeader } from "../../components/base/PageHeader"
import { MonthPickerModal } from "../../components/transactions/MonthPickerModal"
import { NewTransactionModal } from "../../components/transactions/NewTransactionModal"
import { TransactionsList } from "../../components/transactions/TransactionsList"
import { TransactionsQuery, TransactionsQueryVariables } from "../../graphql-types"
import { decrementMonth, incrementMonth } from "../../utils/date"
import { QueryResource } from "../../utils/graphqlClient/useQuery"
import { setTransactionsViewPreference } from "../../utils/transactions/viewPreference"

export interface TransactionsCalendarPageData {
  data: QueryResource<TransactionsQuery, TransactionsQueryVariables>
  year: string
  month: string
}

const TransactionsCalendarPage: Component = () => {
  onMount(() => setTransactionsViewPreference("calendar"))

  const navigate = useNavigate()
  const routeData = useRouteData<TransactionsCalendarPageData>()
  const [pickingMonth, setPickingMonth] = createSignal(false)
  const [creatingTransaction, setCreatingTransaction] = createSignal(false)

  const monthStart = () => new Date(parseInt(routeData.year), parseInt(routeData.month) - 1, 1)

  const isCurrentMonth = () => {
    const now = new Date()
    return monthStart().getTime() === new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  }

  const navigateToMonth = (year: number, monthNumber: number) =>
    navigate(`/transactions/calendar/${year}-${monthNumber.toString().padStart(2, "0")}`)

  const step = (changeMonth: typeof incrementMonth) => {
    const { year, monthNumber } = changeMonth({
      year: parseInt(routeData.year),
      monthNumber: parseInt(routeData.month)
    })
    navigateToMonth(year, monthNumber)
  }

  let touchStart: { x: number; y: number } | undefined

  const onTouchStart = (event: TouchEvent) => {
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY }
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (!touchStart) return
    const deltaX = event.changedTouches[0].clientX - touchStart.x
    const deltaY = event.changedTouches[0].clientY - touchStart.y
    touchStart = undefined

    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 2) {
      if (deltaX < 0 && isCurrentMonth()) return
      step(deltaX < 0 ? incrementMonth : decrementMonth)
    }
  }

  return (
    <>
      <Title>Transactions</Title>

      <button
        class="fixed bottom-[calc(66px+1rem+env(safe-area-inset-bottom))] right-4 z-[1025] flex items-center rounded-full border border-gray-200 bg-white px-5 py-2 text-lg text-indigo-600 shadow-lg md:hidden"
        onClick={() => setCreatingTransaction(true)}
      >
        <IconPlus size="1.25em" class="-ml-1 mr-2" />
        Add
      </button>
      <PageHeader size="lg">
        <span class="mr-auto">Transactions</span>
        <Button
          class="mr-2 rounded-full bg-white border border-gray-200 text-indigo-600 hidden md:flex hover:!bg-gray-100"
          colorScheme="neutral"
          variant="solid"
          onClick={() => setCreatingTransaction(true)}
        >
          <IconPlus size="1.25em" class="-ml-1 mr-1" />
          Add
        </Button>

        <Button
          class="ml-2"
          colorScheme="neutral"
          variant="ghost"
          size="square"
          aria-label="List"
          onClick={() => navigate("/transactions/list")}
        >
          <IconList size="1.25em" />
        </Button>
      </PageHeader>

      <div class="mx-4 mb-4 flex gap-2">
        <Button
          size="square"
          aria-label="Previous month"
          onClick={() => step(decrementMonth)}
        >
          <IconArrowLeft size="1.25em" />
        </Button>

        <button
          type="button"
          class="flex flex-1 items-center justify-center rounded-sm px-4 font-semibold transition hover:bg-gray-300"
          onClick={() => setPickingMonth(true)}
        >
          {monthStart().toLocaleDateString("default", { month: "long", year: "numeric" })}
        </button>

        <Button
          size="square"
          aria-label="Next month"
          onClick={() => step(incrementMonth)}
          disabled={isCurrentMonth()}
        >
          <IconArrowRight size="1.25em" />
        </Button>
      </div>

      <Show when={creatingTransaction()}>
        <NewTransactionModal isOpen={true} onClose={() => setCreatingTransaction(false)} />
      </Show>

      <Show when={pickingMonth()}>
        <MonthPickerModal
          isOpen={true}
          initialDate={monthStart()}
          onClose={() => setPickingMonth(false)}
          onSelect={(dateFrom) => navigateToMonth(dateFrom.getFullYear(), dateFrom.getMonth() + 1)}
        />
      </Show>

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Cell
          data={routeData.data}
          success={TransactionsList}
          successProps={{
            isFiltering: true,
            hideMonthHeaders: true,
            setFilterValue: () => {}
          }}
        />
      </div>
    </>
  )
}

export default TransactionsCalendarPage
