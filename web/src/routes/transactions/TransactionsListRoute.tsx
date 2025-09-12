import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useTransactionsQuery } from "../../graphql/queries/transactionsQuery"
import { TransactionsListPageData } from "../../pages/transactions/TransactionsListPage"

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

const TransactionsListPage = lazy(() => import("../../pages/transactions/TransactionsListPage"))

export const TransactionsListRoute: Component = () => {
  return (
    <Route
      path="/transactions/list/:filter?"
      component={TransactionsListPage}
      data={transactionsData}
    />
  )
}
