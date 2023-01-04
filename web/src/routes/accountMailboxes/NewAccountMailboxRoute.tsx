import { Route } from "@solidjs/router"
import { Component, lazy } from "solid-js"

const NewAccountMailboxPage = lazy(() => import("../../pages/accountMailboxes/NewAccountMailboxPage"))

export const NewAccountMailboxRoute: Component = () => {
  return <Route path="/account-mailboxes/new" component={NewAccountMailboxPage} />
}
