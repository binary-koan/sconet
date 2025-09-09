import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useTransactionsQuery } from "../../graphql/queries/transactionsQuery.ts"
import { TransactionsListPageData } from "../../pages/transactions/TransactionsListPage.tsx"

const transactionsData: RouteDataFunc<unknown, TransactionsListPageData> = ({
  params,
  location
}) => {
  const variables = () => ({
    limit: parseInt(new URLSearchParams(location.search).get("limit") || "100"),
    filter: JSON.parse(params.filter ? decodeURIComponent(params.filter) : "{}")
  })

  const data = useTransactionsQuery(variables)

  return {
    data,
    get variables() {
      return variables()
    }
  }
}

const TransactionsListPage = lazy(() => import("../../pages/transactions/TransactionsListPage.tsx"))

export const TransactionsListRoute: Component = () => {
  return (
    <Route
      path="/transactions/list/:filter?"
      component={TransactionsListPage}
      data={transactionsData}
    />
  )
}
