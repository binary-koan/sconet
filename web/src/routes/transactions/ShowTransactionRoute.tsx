import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useGetTransactionQuery } from "../../graphql/queries/getTransactionQuery.ts"
import { ShowTransactionPageData } from "../../pages/transactions/ShowTransactionPage.tsx"

const showTransactionData: RouteDataFunc<unknown, ShowTransactionPageData> = ({ params }) => {
  const data = useGetTransactionQuery(() => ({ id: params.id }))

  return { data }
}

const ShowTransactionPage = lazy(() => import("../../pages/transactions/ShowTransactionPage.tsx"))

export const ShowTransactionRoute: Component = () => {
  return (
    <Route path="/transactions/:id" component={ShowTransactionPage} data={showTransactionData} />
  )
}
