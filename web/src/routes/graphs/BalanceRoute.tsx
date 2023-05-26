import { Navigate, Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useBalanceQuery } from "../../graphql/queries/balanceQuery"
import { useCurrentUserQuery } from "../../graphql/queries/currentUserQuery"
import type { BalancePageData } from "../../pages/graphs/BalancePage"
import { lastViewedBalance } from "../../utils/transactions/viewPreference"

const balanceRouteData: RouteDataFunc<unknown, BalancePageData> = ({ params }) => {
  const currentUser = useCurrentUserQuery()

  // TODO: This currently fetches twice, maybe add a skip option to useQuery
  const data = useBalanceQuery(() => ({
    currencyCode: currentUser()?.currentUser?.defaultCurrency.code,
    year: parseInt(params.year)
  }))

  return {
    data,
    currentUser,

    get year() {
      return params.year
    }
  }
}

const BalancePage = lazy(() => import("../../pages/graphs/BalancePage"))

export const BalanceRoute: Component = () => {
  const currentYear = () => new Date().getFullYear().toString()

  return (
    <>
      <Route
        path="/graphs/balance"
        element={<Navigate href={`/graphs/balance/${lastViewedBalance() || currentYear()}`} />}
      />
      <Route path="/graphs/balance/:year" component={BalancePage} data={balanceRouteData} />
    </>
  )
}
