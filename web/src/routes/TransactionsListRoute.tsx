import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useTransactionsQuery } from "../graphql/queries/transactionsQuery"
import { TransactionsListPageData } from "../pages/TransactionsListPage"

const transactionsData: RouteDataFunc<unknown, TransactionsListPageData> = ({
  params,
  location
}) => {
  const [data] = useTransactionsQuery(() => ({
    limit: parseInt(new URLSearchParams(location.search).get("limit") || "100"),
    filter: JSON.parse(params.filter || "{}")
  }))

  return { data }
}

const TransactionsListPage = lazy(() => import("../pages/TransactionsListPage"))

export const TransactionsListRoute: Component = () => {
  return (
    <Route
      path="/transactions/list/:filter?"
      component={TransactionsListPage}
      data={transactionsData}
    />
  )
}
