import { Route } from "@solidjs/router"
import { Component, lazy } from "solid-js"

const NewAccountPage = lazy(() => import("../../pages/accounts/NewAccountPage.tsx"))

export const NewAccountRoute: Component = () => {
  return <Route path="/accounts/new" component={NewAccountPage} />
}
