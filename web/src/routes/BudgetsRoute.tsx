import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useBudgetQuery } from "../graphql/queries/budgetQuery"
import type { BudgetsPageData } from "../pages/BudgetsPage"

const budgetsRouteData: RouteDataFunc<unknown, BudgetsPageData> = ({ params }) => {
  const year = () =>
    params.yearmonth ? parseInt(params.yearmonth.split("-")[0]) : new Date().getFullYear()

  const month = () =>
    params.yearmonth ? parseInt(params.yearmonth.split("-")[1]) : new Date().getMonth() + 1

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
