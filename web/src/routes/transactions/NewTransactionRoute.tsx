import { Route } from "@solidjs/router"
import { Component, lazy } from "solid-js"

const NewTransactionPage = lazy(() => import("../../pages/transactions/NewTransactionPage"))

export const NewTransactionRoute: Component = () => {
  return <Route path="/transactions/new" component={NewTransactionPage} />
}
