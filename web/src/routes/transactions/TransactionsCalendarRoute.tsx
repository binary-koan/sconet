import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery"
import { useTransactionsByDayQuery } from "../../graphql/queries/transactionsByDayQuery"
import { TransactionsCalendarPageData } from "../../pages/transactions/TransactionsCalendarPage"
import { preferredCurrency } from "../../utils/settings"

const transactionsData: RouteDataFunc<unknown, TransactionsCalendarPageData> = ({ params }) => {
  const year = () => params.yearmonth.split("-")[0]
  const month = () => params.yearmonth.split("-")[1]
  const lastDateOfMonth = () =>
    new Date(parseInt(year()), parseInt(month()), 0).getDate().toString().padStart(2, "0")

  const data = useTransactionsByDayQuery(() => ({
    currencyId: preferredCurrency(),
    dateFrom: `${year()}-${month()}-01`,
    dateUntil: `${year()}-${month()}-${lastDateOfMonth()}`
  }))

  const currencies = useCurrenciesQuery()

  return {
    data,
    currencies,

    get year() {
      return year()
    },

    get month() {
      return month()
    }
  }
}

const TransactionsCalendarPage = lazy(
  () => import("../../pages/transactions/TransactionsCalendarPage")
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
