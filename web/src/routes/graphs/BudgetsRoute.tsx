import { Navigate, Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useBudgetQuery } from "../../graphql/queries/budgetQuery.ts"
import { useCurrentUserQuery } from "../../graphql/queries/currentUserQuery.ts"
import type { BudgetsPageData } from "../../pages/graphs/BudgetsPage.tsx"
import { stripTime } from "../../utils/date.ts"
import { lastViewedBudget } from "../../utils/transactions/viewPreference.ts"

const budgetsRouteData: RouteDataFunc<unknown, BudgetsPageData> = ({ params }) => {
  const year = () => params.yearmonth.split("-")[0]
  const month = () => params.yearmonth.split("-")[1]
  const monthStart = () => stripTime(new Date(parseInt(year()), parseInt(month()) - 1, 1))
  const monthEnd = () => {
    const date = new Date(parseInt(year()), parseInt(month()), 1)
    date.setDate(date.getDate() - 1)
    return stripTime(date)
  }

  const currentUser = useCurrentUserQuery()

  // TODO: This currently fetches twice, maybe add a skip option to useQuery
  const data = useBudgetQuery(() => ({
    currencyId: currentUser()?.currentUser?.defaultCurrency?.id,
    year: parseInt(year()),
    month: parseInt(month()),
    monthStart: monthStart(),
    monthEnd: monthEnd()
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

const BudgetsPage = lazy(() => import("../../pages/graphs/BudgetsPage.tsx"))

export const BudgetsRoute: Component = () => {
  const currentYearMonth = () =>
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`

  return (
    <>
      <Route
        path="/graphs/budgets"
        element={<Navigate href={`/graphs/budgets/${lastViewedBudget() || currentYearMonth()}`} />}
      />
      <Route path="/graphs/budgets/:yearmonth" component={BudgetsPage} data={budgetsRouteData} />
    </>
  )
}
