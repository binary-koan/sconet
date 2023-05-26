import { Title } from "@solidjs/meta"
import { useNavigate, useRouteData } from "@solidjs/router"
import { TbList } from "solid-icons/tb"
import { Component, Show, onMount } from "solid-js"
import { Cell } from "../../components/Cell"
import { Button } from "../../components/base/Button"
import { PageHeader } from "../../components/base/PageHeader"
import { DefaultCurrencySelect } from "../../components/currencies/DefaultCurrencySelect"
import { TransactionsCalendar } from "../../components/transactions/TransactionsCalendar"
import {
  CurrentUserQuery,
  CurrentUserQueryVariables,
  TransactionsByDayQuery,
  TransactionsByDayQueryVariables
} from "../../graphql-types"
import { QueryResource } from "../../utils/graphqlClient/useQuery"
import { setTransactionsViewPreference } from "../../utils/transactions/viewPreference"

export interface TransactionsCalendarPageData {
  data: QueryResource<TransactionsByDayQuery, TransactionsByDayQueryVariables>
  currentUser: QueryResource<CurrentUserQuery, CurrentUserQueryVariables>
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

        <Show when={routeData.currentUser()?.currentUser}>
          <DefaultCurrencySelect
            favoriteCurrencies={routeData.currentUser()!.currentUser!.favoriteCurrencies}
            defaultCurrency={routeData.currentUser()!.currentUser!.defaultCurrency}
          />
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
