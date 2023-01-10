import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useGetAccountMailboxQuery } from "../../graphql/queries/getAccountMailboxQuery"
import { EditAccountMailboxPageData } from "../../pages/accountMailboxes/EditAccountMailboxPage"

const editAccountMailboxData: RouteDataFunc<unknown, EditAccountMailboxPageData> = ({ params }) => {
  const data = useGetAccountMailboxQuery(() => ({ id: params.id }))

  return { data }
}

const EditAccountMailboxPage = lazy(
  () => import("../../pages/accountMailboxes/EditAccountMailboxPage")
)

export const EditAccountMailboxRoute: Component = () => {
  return (
    <Route
      path="/account-mailboxes/:id"
      component={EditAccountMailboxPage}
      data={editAccountMailboxData}
    />
  )
}
