import { Route } from "@solidjs/router"
import { Component, lazy } from "solid-js"

const NewAccountPage = lazy(() => import("../../pages/accounts/NewAccountPage"))

export const NewAccountRoute: Component = () => {
  return <Route path="/accounts/new" component={NewAccountPage} />
}
