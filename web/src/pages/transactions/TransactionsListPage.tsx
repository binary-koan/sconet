import { Title } from "@solidjs/meta"
import { useRouteData } from "@solidjs/router"
import { Component, createSignal, onMount } from "solid-js"
import { Cell } from "../../components/Cell"
import { TransactionsActions } from "../../components/transactions/TransactionsActions"
import {
  TransactionFilterValues,
  TransactionFiltersModal,
  parseFilterValues,
  serializeFilterValues
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

  const routeData = useRouteData<TransactionsListPageData>()
  const [isFiltering, setFiltering] = createSignal(false)

  const { form, filterCount, hasFilterValues, clearFilters, setFilterValue } =
    usePageFilter<TransactionFilterValues>({
      basePath: "/transactions/list",
      paramName: "filter",
      localStorageKey: FILTERS_KEY,
      initialValues: BLANK_FILTERS,
      parse: parseFilterValues,
      serialize: serializeFilterValues
    })

  return (
    <>
      <Title>Transactions</Title>

      <TransactionsActions
        view="list"
        filterCount={filterCount()}
        onFilter={() => setFiltering(true)}
      />

      <TransactionFiltersModal
        isOpen={isFiltering()}
        form={form}
        clearFilters={clearFilters}
        hasFilterValues={hasFilterValues()}
        onClose={() => setFiltering(false)}
      />

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
