import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useCurrentUserQuery } from "../../graphql/queries/currentUserQuery.ts"
import { useTransactionsByDayQuery } from "../../graphql/queries/transactionsByDayQuery.ts"
import { TransactionsCalendarPageData } from "../../pages/transactions/TransactionsCalendarPage.tsx"

const transactionsData: RouteDataFunc<unknown, TransactionsCalendarPageData> = ({ params }) => {
  const year = () => params.yearmonth.split("-")[0]
  const month = () => params.yearmonth.split("-")[1]
  const lastDateOfMonth = () =>
    new Date(parseInt(year()), parseInt(month()), 0).getDate().toString().padStart(2, "0")

  const currentUser = useCurrentUserQuery()

  // TODO: This currently fetches twice, maybe add a skip option to useQuery
  const data = useTransactionsByDayQuery(() => ({
    currencyId: currentUser()?.currentUser?.defaultCurrency?.id,
    dateFrom: `${year()}-${month()}-01`,
    dateUntil: `${year()}-${month()}-${lastDateOfMonth()}`
  }))

  return {
    data,
    currentUser,

    get year() {
      return year()
    },

    get month() {
      return month()
    }
  }
}

const TransactionsCalendarPage = lazy(
  () => import("../../pages/transactions/TransactionsCalendarPage.tsx")
)

export const TransactionsCalendarRoute: Component = () => {
  return (
    <Route
      path="/transactions/calendar/:yearmonth"
      component={TransactionsCalendarPage}
      data={transactionsData}
    />
  )
}
