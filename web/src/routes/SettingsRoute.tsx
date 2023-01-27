import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useAccountMailboxesQuery } from "../graphql/queries/accountMailboxesQuery"
import { useCategoriesQuery } from "../graphql/queries/categoriesQuery"
import { useCurrenciesQuery } from "../graphql/queries/currenciesQuery"
import { useCurrentExchangeRatesQuery } from "../graphql/queries/currentExchangeRatesQuery"
import { useCurrentUserQuery } from "../graphql/queries/currentUserQuery"
import { SettingsPageData } from "../pages/SettingsPage"

const settingsData: RouteDataFunc<unknown, SettingsPageData> = () => {
  const categories = useCategoriesQuery()
  const accountMailboxes = useAccountMailboxesQuery()
  const currentUser = useCurrentUserQuery()
  const currencies = useCurrenciesQuery()
  const currentExchangeRates = useCurrentExchangeRatesQuery()

  return { categories, accountMailboxes, currentUser, currencies, currentExchangeRates }
}

const SettingsPage = lazy(() => import("../pages/SettingsPage"))

export const SettingsRoute: Component = () => {
  return <Route path="/settings" component={SettingsPage} data={settingsData} />
}
