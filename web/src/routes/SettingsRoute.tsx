import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useAccountsQuery } from "../graphql/queries/accountsQuery"
import { useCategoriesQuery } from "../graphql/queries/categoriesQuery"
import { useCurrentUserQuery } from "../graphql/queries/currentUserQuery"
import { useFavouriteTransactionsQuery } from "../graphql/queries/favouriteTransactionsQuery"
import { SettingsPageData } from "../pages/SettingsPage"
import { stripTime } from "../utils/date"

const settingsData: RouteDataFunc<unknown, SettingsPageData> = () => {
  const categories = useCategoriesQuery(() => ({ archived: false, today: stripTime(new Date()) }))
  const accounts = useAccountsQuery(() => ({ archived: false }))
  const currentUser = useCurrentUserQuery()
  const favouriteTransactions = useFavouriteTransactionsQuery()

  return { categories, accounts, currentUser, favouriteTransactions }
}

const SettingsPage = lazy(() => import("../pages/SettingsPage"))

export const SettingsRoute: Component = () => {
  return <Route path="/settings" component={SettingsPage} data={settingsData} />
}
