import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useUnconfirmedTransactionsQuery } from "../../graphql/queries/unconfirmedTransactionsQuery"
import { ReviewTransactionsPageData } from "../../pages/transactions/ReviewTransactionsPage"

const reviewTransactionsData: RouteDataFunc<unknown, ReviewTransactionsPageData> = () => {
  const data = useUnconfirmedTransactionsQuery()

  return { data }
}

const ReviewTransactionsPage = lazy(() => import("../../pages/transactions/ReviewTransactionsPage"))

export const ReviewTransactionsRoute: Component = () => {
  return (
    <Route path="/review" component={ReviewTransactionsPage} data={reviewTransactionsData} />
  )
}
