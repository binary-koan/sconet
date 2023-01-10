import { Title } from "@solidjs/meta"
import { useNavigate, useRouteData } from "@solidjs/router"
import { TbLayoutList } from "solid-icons/tb"
import { Component, onMount } from "solid-js"
import { Button } from "../../components/base/Button"
import { PageHeader } from "../../components/base/PageHeader"
import { Cell } from "../../components/Cell"
import { TransactionsCalendar } from "../../components/transactions/TransactionsCalendar"
import { TransactionsByDayQuery, TransactionsByDayQueryVariables } from "../../graphql-types"
import { QueryResource } from "../../graphqlClient"
import { setTransactionsViewPreference } from "../../utils/transactions/viewPreference"

export interface TransactionsCalendarPageData {
  data: QueryResource<TransactionsByDayQuery, TransactionsByDayQueryVariables>
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
        <Button
          class="ml-2"
          colorScheme="neutral"
          variant="ghost"
          size="square"
          aria-label="List"
          onClick={() => navigate("/transactions/list")}
        >
          <TbLayoutList size="1.25em" />
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
