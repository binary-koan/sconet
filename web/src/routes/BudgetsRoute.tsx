import { Route, RouteDataFunc, useSearchParams } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useBudgetQuery } from "../graphql/queries/budgetQuery"
import { BudgetsPageData } from "../pages/BudgetsPage"

const budgetsRouteData: RouteDataFunc<unknown, BudgetsPageData> = () => {
  const [searchParams] = useSearchParams()

  const year = () => (searchParams.year ? parseInt(searchParams.year!) : new Date().getFullYear())
  const month = () =>
    searchParams.month ? parseInt(searchParams.month!) : new Date().getMonth() + 1

  const [data] = useBudgetQuery(() => ({
    year: year(),
    month: month()
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

const BudgetsPage = lazy(() => import("../pages/BudgetsPage"))

export const BudgetsRoute: Component = () => {
  return <Route path="/budgets/:yearmonth?" component={BudgetsPage} data={budgetsRouteData} />
}
