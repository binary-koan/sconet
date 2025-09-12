import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery"
import { useCurrentUserQuery } from "../../graphql/queries/currentUserQuery"
import { CurrenciesPageData } from "../../pages/settings/CurrenciesPage"

const currenciesData: RouteDataFunc<unknown, CurrenciesPageData> = () => {
  const currentUser = useCurrentUserQuery()
  const currencies = useCurrenciesQuery()

  return { currentUser, currencies }
}

const CurrenciesPage = lazy(() => import("../../pages/settings/CurrenciesPage"))

export const CurrenciesRoute: Component = () => {
  return <Route path="/settings/currencies" component={CurrenciesPage} data={currenciesData} />
}
