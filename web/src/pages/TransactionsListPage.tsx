import { Title } from "@solidjs/meta"
import { Link, useNavigate, useRouteData } from "@solidjs/router"
import { TbCalendarEvent, TbEdit, TbFilter, TbPlus, TbX } from "solid-icons/tb"
import { Component, createSignal, onMount, Resource } from "solid-js"
import { Button } from "../components/base/Button"
import { PageHeader } from "../components/base/PageHeader"
import { Cell } from "../components/Cell"
import TransactionFilters, {
  TransactionFilterValues
} from "../components/transactions/TransactionFilters"
import { TransactionsList } from "../components/transactions/Transactions"
import { TransactionsQuery } from "../graphql-types"
import usePageFilter from "../hooks/usePageFilter"
import { setTransactionsViewPreference } from "../utils/transactions/viewPreference"

const FILTERS_KEY = "sconet.transactionFilters"
const BLANK_FILTERS = {
  keyword: "",
  categoryIds: [],
  dateFrom: undefined,
  dateUntil: undefined
}

export interface TransactionsListPageData {
  data: Resource<TransactionsQuery>
}

const TransactionsListPage: Component = () => {
  onMount(() => setTransactionsViewPreference("list"))

  const navigate = useNavigate()
  const routeData = useRouteData<TransactionsListPageData>()
  const [isEditing, setEditing] = createSignal(false)
  const [isFiltering, setFiltering] = createSignal(false)

  const { form, hasFilterValues, filterCount, clearFilters, setFilter } =
    usePageFilter<TransactionFilterValues>({
      basePath: "/transactions/list",
      paramName: "filter",
      localStorageKey: FILTERS_KEY,
      initialValues: BLANK_FILTERS
    })

  return (
    <>
      <Title>Transactions</Title>

      <PageHeader size="lg">
        <span class="mr-auto">Transactions</span>
        <Button
          class="mr-2"
          classList={{ hidden: !hasFilterValues() }}
          size="sm"
          colorScheme="primary"
          onClick={clearFilters}
        >
          {filterCount()} {filterCount() === 1 ? "filter" : "filters"}
          <TbX class="ml-2" />
        </Button>
        <Button
          colorScheme={isFiltering() ? "primary" : "neutral"}
          variant={isFiltering() ? "solid" : "ghost"}
          size="square"
          aria-label="Filter"
          onClick={() => setFiltering((isFiltering) => !isFiltering)}
        >
          <TbFilter size="1.25em" />
        </Button>
        <Button
          class="ml-2"
          colorScheme={isEditing() ? "primary" : "neutral"}
          variant={isEditing() ? "solid" : "ghost"}
          size="square"
          aria-label="Edit"
          onClick={() => setEditing((isEditing) => !isEditing)}
        >
          <TbEdit size="1.25em" />
        </Button>
        <Button
          class="ml-2"
          colorScheme="neutral"
          variant="ghost"
          size="square"
          aria-label="Edit"
          onClick={() => navigate("/transactions/calendar")}
        >
          <TbCalendarEvent size="1.25em" />
        </Button>
        <Link
          class="z-navbar fixed bottom-[calc(66px+1rem+env(safe-area-inset-bottom))] right-4 flex items-center rounded-full border border-gray-200 bg-white py-2 px-5 text-lg text-violet-600 shadow-lg lg:static lg:z-0 lg:ml-2 lg:shadow-none"
          href="/transactions/new"
        >
          <TbPlus size="1.25em" class="mr-2 -ml-1" />
          Add
        </Link>
      </PageHeader>
      <div classList={{ block: isFiltering(), hidden: !isFiltering() }}>
        <TransactionFilters form={form} />
      </div>
      <Cell
        data={routeData.data}
        success={TransactionsList}
        successProps={{ isEditing: isEditing(), setFilter, fetchMore: () => {} }}
      />
    </>
  )
}

export default TransactionsListPage
