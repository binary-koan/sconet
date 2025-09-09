import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery.ts"
import { useCurrentUserQuery } from "../../graphql/queries/currentUserQuery.ts"
import { CurrenciesPageData } from "../../pages/settings/CurrenciesPage.tsx"

const currenciesData: RouteDataFunc<unknown, CurrenciesPageData> = () => {
  const currentUser = useCurrentUserQuery()
  const currencies = useCurrenciesQuery()

  return { currentUser, currencies }
}

const CurrenciesPage = lazy(() => import("../../pages/settings/CurrenciesPage.tsx"))

export const CurrenciesRoute: Component = () => {
  return <Route path="/settings/currencies" component={CurrenciesPage} data={currenciesData} />
}
