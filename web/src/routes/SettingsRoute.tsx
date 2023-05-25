import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useAccountsQuery } from "../graphql/queries/accountsQuery"
import { useCategoriesQuery } from "../graphql/queries/categoriesQuery"
import { useCurrenciesQuery } from "../graphql/queries/currenciesQuery"
import { useCurrentUserQuery } from "../graphql/queries/currentUserQuery"
import { SettingsPageData } from "../pages/SettingsPage"

const settingsData: RouteDataFunc<unknown, SettingsPageData> = () => {
  const categories = useCategoriesQuery()
  const accounts = useAccountsQuery()
  const currentUser = useCurrentUserQuery()
  const currencies = useCurrenciesQuery()

  return { categories, accounts, currentUser, currencies }
}

const SettingsPage = lazy(() => import("../pages/SettingsPage"))

export const SettingsRoute: Component = () => {
  return <Route path="/settings" component={SettingsPage} data={settingsData} />
}
