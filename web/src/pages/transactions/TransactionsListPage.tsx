import { Title } from "@solidjs/meta"
import { useNavigate, useRouteData } from "@solidjs/router"
import { IconCalendarEvent, IconFilter, IconPlus } from "@tabler/icons-solidjs"
import { Component, Show, createSignal, onMount } from "solid-js"
import { Cell } from "../../components/Cell"
import { Button } from "../../components/base/Button"
import { PageHeader } from "../../components/base/PageHeader"
import { NewTransactionModal } from "../../components/transactions/NewTransactionModal"
import {
  TransactionFilterValues,
  TransactionFilters
} from "../../components/transactions/TransactionFilters"
import { TransactionsList } from "../../components/transactions/TransactionsList"
import { TransactionsQuery, TransactionsQueryVariables } from "../../graphql-types"
import usePageFilter from "../../hooks/usePageFilter"
import { QueryResource } from "../../utils/graphqlClient/useQuery"
import { setTransactionsViewPreference } from "../../utils/transactions/viewPreference"

const FILTERS_KEY = "sconet.transactionFilters"
const BLANK_FILTERS = {
  keyword: "",
  categoryIds: [],
  dateFrom: undefined,
  dateUntil: undefined
}

export interface TransactionsListPageData {
  data: QueryResource<TransactionsQuery, TransactionsQueryVariables>
  variables: TransactionsQueryVariables
}

const TransactionsListPage: Component = () => {
  onMount(() => setTransactionsViewPreference("list"))

  const navigate = useNavigate()
  const routeData = useRouteData<TransactionsListPageData>()
  const [isFiltering, setFiltering] = createSignal(false)
  const [creatingTransaction, setCreatingTransaction] = createSignal(false)

  const { form, filterCount, hasFilterValues, clearFilters, setFilterValue } =
    usePageFilter<TransactionFilterValues>({
      basePath: "/transactions/list",
      paramName: "filter",
      localStorageKey: FILTERS_KEY,
      initialValues: BLANK_FILTERS,
      parse: (value) => {
        const data = JSON.parse(value)
        return {
          ...data,
          minAmount: data.minAmount?.toString(),
          maxAmount: data.minAmount?.toString(),
          categoryIds: data.categoryIds?.map((categoryId: string | null) => categoryId || "") || []
        }
      },
      serialize: (value) => {
        return JSON.stringify({
          ...value,
          minAmount: value.minAmount != null ? parseInt(value.minAmount) : undefined,
          maxAmount: value.maxAmount != null ? parseInt(value.maxAmount) : undefined,
          categoryIds: value.categoryIds?.map((categoryId) => categoryId || null)
        })
      }
    })

  return (
    <>
      <Title>Transactions</Title>

      <PageHeader size="lg" class="z-docked sticky top-0 bg-gray-50 md:top-9">
        <span class="mr-auto">Transactions</span>
        <button
          class="z-navbar fixed bottom-[calc(66px+1rem+env(safe-area-inset-bottom))] right-4 flex items-center rounded-full border border-gray-200 bg-white px-5 py-2 text-lg text-indigo-600 shadow-lg md:static md:z-0 md:-my-1 md:mr-2 md:shadow-none"
          onClick={() => setCreatingTransaction(true)}
        >
          <IconPlus size="1.25em" class="-ml-1 mr-2" />
          Add
        </button>
        <Button
          colorScheme={isFiltering() ? "primary" : "neutral"}
          variant={isFiltering() ? "solid" : "ghost"}
          size={hasFilterValues() ? "md" : "square"}
          aria-label="Filter"
          onClick={() => setFiltering((isFiltering) => !isFiltering)}
        >
          <IconFilter size="1.25em" />
          {hasFilterValues() && `(${filterCount()})`}
        </Button>
        <Button
          class="ml-2"
          colorScheme="neutral"
          variant="ghost"
          size="square"
          aria-label="Edit"
          onClick={() => navigate("/transactions/calendar")}
        >
          <IconCalendarEvent size="1.25em" />
        </Button>
      </PageHeader>

      <Show when={creatingTransaction()}>
        <NewTransactionModal isOpen={true} onClose={() => setCreatingTransaction(false)} />
      </Show>

      <div classList={{ block: isFiltering(), hidden: !isFiltering() }}>
        <TransactionFilters
          form={form}
          clearFilters={clearFilters}
          hasFilterValues={hasFilterValues()}
        />
      </div>

      <Cell
        data={routeData.data}
        success={TransactionsList}
        successProps={{
          isFiltering: filterCount() > 0,
          setFilterValue,
          fetchMore: () =>
            routeData.data.fetchMore(
              {
                ...routeData.variables,
                offset: routeData.data()?.transactions.pageInfo.endCursor
              },
              (existingData, newData) => ({
                ...newData,
                transactions: {
                  ...newData.transactions,
                  nodes: existingData.transactions.nodes.concat(newData.transactions.nodes)
                }
              })
            )
        }}
      />
    </>
  )
}

export default TransactionsListPage
