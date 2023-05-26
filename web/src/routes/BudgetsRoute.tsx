import { Navigate, Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useBudgetQuery } from "../graphql/queries/budgetQuery"
import { useCurrentUserQuery } from "../graphql/queries/currentUserQuery"
import type { BudgetsPageData } from "../pages/BudgetsPage"
import { stripTime } from "../utils/date"
import { lastViewedBudget } from "../utils/transactions/viewPreference"

const budgetsRouteData: RouteDataFunc<unknown, BudgetsPageData> = ({ params }) => {
  const year = () => params.yearmonth.split("-")[0]
  const month = () => params.yearmonth.split("-")[1]

  const currentUser = useCurrentUserQuery()

  // TODO: This currently fetches twice, maybe add a skip option to useQuery
  const data = useBudgetQuery(() => ({
    currencyCode: currentUser()?.currentUser?.defaultCurrency.code,
    year: parseInt(year()),
    month: parseInt(month()),
    monthStart: stripTime(new Date(parseInt(year()), parseInt(month()) - 1, 1))
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

const BudgetsPage = lazy(() => import("../pages/BudgetsPage"))

export const BudgetsRoute: Component = () => {
  const currentYearMonth = () =>
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`

  return (
    <>
      <Route
        path="/budgets"
        element={<Navigate href={`/budgets/${lastViewedBudget() || currentYearMonth()}`} />}
      />
      <Route path="/budgets/:yearmonth" component={BudgetsPage} data={budgetsRouteData} />
    </>
  )
}
