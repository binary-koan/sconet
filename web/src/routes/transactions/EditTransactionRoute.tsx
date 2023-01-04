import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useGetTransactionQuery } from "../../graphql/queries/getTransactionQuery"
import { EditTransactionPageData } from "../../pages/transactions/EditTransactionPage"

const editTransactionData: RouteDataFunc<unknown, EditTransactionPageData> = ({ params }) => {
  const [data] = useGetTransactionQuery(() => ({ id: params.id }))

  return { data }
}

const EditTransactionPage = lazy(() => import("../../pages/transactions/EditTransactionPage"))

export const EditTransactionRoute: Component = () => {
  return (
    <Route path="/transactions/:id" component={EditTransactionPage} data={editTransactionData} />
  )
}
