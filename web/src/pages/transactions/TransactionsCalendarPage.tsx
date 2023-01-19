import { Title } from "@solidjs/meta"
import { useNavigate, useRouteData } from "@solidjs/router"
import { TbList } from "solid-icons/tb"
import { Component, onMount, Show } from "solid-js"
import { Button } from "../../components/base/Button"
import { PageHeader } from "../../components/base/PageHeader"
import { Cell } from "../../components/Cell"
import { PreferredCurrencySelect } from "../../components/PreferredCurrencySelect"
import { TransactionsCalendar } from "../../components/transactions/TransactionsCalendar"
import {
  CurrenciesQuery,
  CurrenciesQueryVariables,
  TransactionsByDayQuery,
  TransactionsByDayQueryVariables
} from "../../graphql-types"
import { QueryResource } from "../../utils/graphqlClient/useQuery"
import { setTransactionsViewPreference } from "../../utils/transactions/viewPreference"

export interface TransactionsCalendarPageData {
  data: QueryResource<TransactionsByDayQuery, TransactionsByDayQueryVariables>
  currencies: QueryResource<CurrenciesQuery, CurrenciesQueryVariables>
  year: string
  month: string
}

const TransactionsCalendarPage: Component = () => {
  onMount(() => setTransactionsViewPreference("calendar"))

  const navigate = useNavigate()
  const routeData = useRouteData<TransactionsCalendarPageData>()

  return (
    <>
      <Title>Transactions</Title>

      <PageHeader size="lg">
        <span class="mr-auto">Transactions</span>

        <Show when={routeData.currencies()?.currencies}>
          <PreferredCurrencySelect currencies={routeData.currencies()!.currencies} />
        </Show>

        <Button
          class="ml-2"
          colorScheme="neutral"
          variant="ghost"
          size="square"
          aria-label="List"
          onClick={() => navigate("/transactions/list")}
        >
          <TbList size="1.25em" />
        </Button>
      </PageHeader>
      <Cell
        data={routeData.data}
        success={TransactionsCalendar}
        successProps={{ year: routeData.year, month: routeData.month }}
      />
    </>
  )
}

export default TransactionsCalendarPage
