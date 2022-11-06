import { Button, Heading, IconButton, Text } from "@hope-ui/solid"
import { Title } from "@solidjs/meta"
import { Link, useRouteData } from "@solidjs/router"
import { TbEdit, TbFilter, TbPlus, TbX } from "solid-icons/tb"
import { Component, createSignal, onMount, Resource } from "solid-js"
import { Dynamic } from "solid-js/web"
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

      <Heading
        fontSize={{ "@initial": "$lg", "@lg": "$2xl" }}
        marginTop="$4"
        marginBottom="$4"
        paddingStart={{ "@initial": "$4", "@lg": "0" }}
        paddingEnd={{ "@initial": "$4", "@lg": "0" }}
        display="flex"
        alignItems="center"
      >
        <Text as="span" marginEnd="auto">
          Transactions
        </Text>
        <Button
          marginEnd="$2"
          display={hasFilterValues() ? "flex" : "none"}
          size="sm"
          fontSize="$xs"
          colorScheme="primary"
          rightIcon={<Dynamic component={TbX} />}
          onClick={clearFilters}
        >
          {filterCount()} {filterCount() === 1 ? "filter" : "filters"}
        </Button>
        <IconButton
          colorScheme={isFiltering() ? "primary" : "neutral"}
          variant={isFiltering() ? "solid" : "ghost"}
          size="sm"
          icon={<Dynamic component={TbFilter} size="1.25em" />}
          aria-label="Filter"
          onClick={() => setFiltering((isFiltering) => !isFiltering)}
        />
        <IconButton
          colorScheme={isEditing() ? "primary" : "neutral"}
          variant={isEditing() ? "solid" : "ghost"}
          size="sm"
          marginStart="$2"
          icon={<Dynamic component={TbEdit} size="1.25em" />}
          aria-label="Edit"
          onClick={() => setEditing((isEditing) => !isEditing)}
        />
        <Button
          as={Link}
          href="/transactions/new"
          position={{ "@initial": "fixed", "@lg": "static" }}
          zIndex={{ "@initial": "dropdown", "@lg": "0" }}
          marginStart={{ "@initial": "0", "@lg": "$2" }}
          bottom="calc(66px + 16px + env(safe-area-inset-bottom))"
          right="$4"
          colorScheme="neutral"
          variant="outline"
          size="lg"
          paddingStart="5"
          borderRadius="$full"
          backgroundColor="$neutral1"
          color="$primary9"
          boxShadow={{ "@initial": "$lg", "@lg": "none" }}
          leftIcon={<Dynamic component={TbPlus} size="1.25em" />}
        >
          Add
        </Button>
      </Heading>
      <TransactionFilters form={form} display={isFiltering() ? "block" : "none"} />
      <Cell
        data={routeData.data}
        success={TransactionsList}
        successProps={{ isEditing: isEditing(), setFilter, fetchMore: () => {} }}
      />
    </>
  )
}

export default TransactionsListPage
