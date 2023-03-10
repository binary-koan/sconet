import { Navigate, Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useBudgetQuery } from "../graphql/queries/budgetQuery"
import { useCurrenciesQuery } from "../graphql/queries/currenciesQuery"
import type { BudgetsPageData } from "../pages/BudgetsPage"
import { preferredCurrency } from "../utils/settings"
import { lastViewedBudget } from "../utils/transactions/viewPreference"

const budgetsRouteData: RouteDataFunc<unknown, BudgetsPageData> = ({ params }) => {
  const year = () => params.yearmonth.split("-")[0]
  const month = () => params.yearmonth.split("-")[1]

  const data = useBudgetQuery(() => ({
    currencyId: preferredCurrency(),
    year: parseInt(year()),
    month: parseInt(month())
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
