import { Title } from "@solidjs/meta"
import { useNavigate, useParams, useRouteData } from "@solidjs/router"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-solidjs"
import { Component, Show, createSignal, onMount } from "solid-js"
import { Cell } from "../../components/Cell"
import { Button } from "../../components/base/Button"
import { MonthPickerModal } from "../../components/transactions/MonthPickerModal"
import {
  TransactionFilterValues,
  TransactionFiltersModal,
  parseFilterValues,
  serializeFilterValues
} from "../../components/transactions/TransactionFilters"
import { TransactionsActions } from "../../components/transactions/TransactionsActions"
import { TransactionsList } from "../../components/transactions/TransactionsList"
import { TransactionsQuery, TransactionsQueryVariables } from "../../graphql-types"
import usePageFilter from "../../hooks/usePageFilter"
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
  const params = useParams()
  const routeData = useRouteData<TransactionsCalendarPageData>()
  const [pickingMonth, setPickingMonth] = createSignal(false)
  const [isFiltering, setFiltering] = createSignal(false)

  const { form, filterCount, hasFilterValues, clearFilters, setFilterValue } =
    usePageFilter<TransactionFilterValues>({
      basePath: () => `/transactions/calendar/${routeData.year}-${routeData.month}`,
      paramName: "filter",
      initialValues: { keyword: "", categoryIds: [] },
      parse: parseFilterValues,
      serialize: serializeFilterValues
    })

  const monthStart = () => new Date(parseInt(routeData.year), parseInt(routeData.month) - 1, 1)

  const isCurrentMonth = () => {
    const now = new Date()
    return monthStart().getTime() === new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  }

  const navigateToMonth = (year: number, monthNumber: number) =>
    navigate(
      `/transactions/calendar/${year}-${monthNumber.toString().padStart(2, "0")}${
        params.filter ? `/${params.filter}` : ""
      }`
    )

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

      <TransactionsActions
        view="calendar"
        filterCount={filterCount()}
        onFilter={() => setFiltering(true)}
      />

      <TransactionFiltersModal
        isOpen={isFiltering()}
        form={form}
        clearFilters={clearFilters}
        hasFilterValues={hasFilterValues()}
        hideDates={true}
        onClose={() => setFiltering(false)}
      />

      <div class="m-4 flex gap-2">
        <Button
          size="square"
          aria-label="Previous month"
          onClick={() => step(decrementMonth)}
        >
          <IconArrowLeft size="1.25em" />
        </Button>

        <button
          type="button"
          class="flex flex-1 items-center justify-center rounded-sm px-4 font-semibold transition hover:bg-accent"
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
            setFilterValue
          }}
        />
      </div>
    </>
  )
}

export default TransactionsCalendarPage
