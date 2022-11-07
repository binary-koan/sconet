import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useTransactionsQuery } from "../graphql/queries/transactionsQuery"
import { TransactionsCalendarPageData } from "../pages/TransactionsCalendarPage"

const transactionsData: RouteDataFunc<unknown, TransactionsCalendarPageData> = ({ params }) => {
  const year = () => params.yearmonth.split("-")[0]
  const month = () => params.yearmonth.split("-")[1]
  const lastDateOfMonth = () =>
    new Date(parseInt(year()), parseInt(month()), 0).getDate().toString().padStart(2, "0")

  const [data] = useTransactionsQuery(() => ({
    filter: {
      dateFrom: `${year()}-${month()}-01`,
      dateUntil: `${year()}-${month()}-${lastDateOfMonth()}`
    }
  }))

  return {
    data,

    get year() {
      return year()
    },

    get month() {
      return month()
    }
  }
}

const TransactionsCalendarPage = lazy(() => import("../pages/TransactionsCalendarPage"))

export const TransactionsCalendarRoute: Component = () => {
  return (
    <Route
      path="/transactions/calendar/:yearmonth"
      component={TransactionsCalendarPage}
      data={transactionsData}
    />
  )
}
