import { Heading, Button, Icon, IconButton, Text } from "@hope-ui/solid"
import { Title } from "@solidjs/meta"
import { Link, Route, useRouteData } from "@solidjs/router"
import { TbCross, TbEdit, TbFilter, TbPlus } from "solid-icons/tb"
import { Component, createEffect, createSignal, Resource } from "solid-js"
import TransactionFilters, {
  TransactionFilterValues
} from "../components/transactions/TransactionFilters"
import { TransactionsCell } from "../components/transactions/TransactionsCell"
import { FindTransactionsQuery } from "../graphql-types"
import { useQuery } from "../graphqlClient"
import usePageFilter from "../hooks/usePageFilter"
import { TRANSACTIONS_QUERY } from "../queries/transactions"

const FILTERS_KEY = "sconet.transactionFilters"
const BLANK_FILTERS = {
  keyword: "",
  categoryIds: [],
  dateFrom: undefined,
  dateUntil: undefined
}

type TransactionsPageData = () => Resource<FindTransactionsQuery>

const TransactionsPage: Component = () => {
  const data = useRouteData<TransactionsPageData>()
  const [isEditing, setEditing] = createSignal(false)
  const [isFiltering, setFiltering] = createSignal(false)

  const { activeFilterValues, filterValues, setFilterValues, hasFilterValues } =
    usePageFilter<TransactionFilterValues>({
      initialValues: localStorage.getItem(FILTERS_KEY)
        ? JSON.parse(localStorage.getItem(FILTERS_KEY)!)
        : BLANK_FILTERS
    })

  createEffect(() => {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(activeFilterValues()))
  })

  const coercedFilterValues = () => {
    const { dateFrom, dateUntil, ...values } = activeFilterValues()

    return {
      ...values,
      dateFrom: dateFrom && new Date(dateFrom).toISOString(),
      dateUntil: dateUntil && new Date(dateUntil).toISOString()
    }
  }

  const activeFilterCount = () =>
    Object.values(activeFilterValues()).filter((value) => (value as any)?.length).length

  return (
    <>
      <Title>Transactions</Title>

      <Heading
        fontSize={{ "@initial": "lg", "@lg": "3xl" }}
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
          display={hasFilterValues() ? "block" : "none"}
          fontSize="xs"
          colorScheme="primary"
          rightIcon={<Icon as={TbCross} />}
          onClick={() => setFilterValues({ ...BLANK_FILTERS })}
        >
          {activeFilterCount} {activeFilterCount() === 1 ? "filter" : "filters"}
        </Button>
        <IconButton
          colorScheme={isFiltering() ? "primary" : "neutral"}
          icon={<Icon as={TbFilter} size="1.25em" />}
          aria-label="Filter"
          onClick={() => setFiltering((isFiltering) => !isFiltering)}
        />
        <IconButton
          colorScheme={isEditing() ? "primary" : "neutral"}
          marginStart="$2"
          icon={<Icon as={TbEdit} size="1.25em" />}
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
          borderRadius="full"
          backgroundColor="$neutral2"
          color="$primary8"
          boxShadow={{ "@initial": "lg", "@lg": "none" }}
          leftIcon={<Icon as={TbPlus} size="lg" />}
        >
          Add
        </Button>
      </Heading>
      <TransactionFilters
        values={filterValues}
        setValues={setFilterValues}
        display={isFiltering() ? "block" : "none"}
      />
      <TransactionsCell
        data={data}
        filter={coercedFilterValues}
        isEditing={isEditing()}
        setFilterValues={setFilterValues}
      />
    </>
  )
}

const transactionsData: TransactionsPageData = () => {
  const [data] = useQuery<FindTransactionsQuery>(TRANSACTIONS_QUERY)

  return data
}

export const TransactionsRoute: Component = () => {
  return <Route path="/transactions" component={TransactionsPage} data={transactionsData} />
}
