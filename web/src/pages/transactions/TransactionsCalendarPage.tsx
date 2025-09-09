import { Title } from "@solidjs/meta"
import { useNavigate, useRouteData } from "@solidjs/router"
import { IconList } from "@tabler/icons-solidjs"
import { Component, Show, onMount } from "solid-js"
import { Cell } from "../../components/Cell.tsx"
import { Button } from "../../components/base/Button.tsx"
import { PageHeader } from "../../components/base/PageHeader.tsx"
import { DefaultCurrencySelect } from "../../components/currencies/DefaultCurrencySelect.tsx"
import { TransactionsCalendar } from "../../components/transactions/TransactionsCalendar.tsx"
import {
  CurrentUserQuery,
  CurrentUserQueryVariables,
  TransactionsByDayQuery,
  TransactionsByDayQueryVariables
} from "../../graphql-types.ts"
import { QueryResource } from "../../utils/graphqlClient/useQuery.ts"
import { setTransactionsViewPreference } from "../../utils/transactions/viewPreference.ts"

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
            favouriteCurrencies={routeData.currentUser()!.currentUser!.favouriteCurrencies}
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
          <IconList size="1.25em" />
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
