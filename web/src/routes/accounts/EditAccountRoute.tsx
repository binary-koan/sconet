import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useGetAccountQuery } from "../../graphql/queries/getAccountQuery.ts"
import { EditAccountPageData } from "../../pages/accounts/EditAccountPage.tsx"

const editAccountData: RouteDataFunc<unknown, EditAccountPageData> = ({ params }) => {
  const data = useGetAccountQuery(() => ({ id: params.id }))

  return { data }
}

const EditAccountPage = lazy(() => import("../../pages/accounts/EditAccountPage.tsx"))

export const EditAccountRoute: Component = () => {
  return <Route path="/accounts/:id" component={EditAccountPage} data={editAccountData} />
}
