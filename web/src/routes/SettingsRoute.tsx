import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useAccountMailboxesQuery } from "../graphql/queries/accountMailboxesQuery"
import { useCategoriesQuery } from "../graphql/queries/categoriesQuery"
import { SettingsPageData } from "../pages/SettingsPage"

const settingsData: RouteDataFunc<unknown, SettingsPageData> = () => {
  const [categories] = useCategoriesQuery()
  const [accountMailboxes] = useAccountMailboxesQuery()

  return { categories, accountMailboxes }
}

const SettingsPage = lazy(() => import("../pages/SettingsPage"))

export const SettingsRoute: Component = () => {
  return <Route path="/settings" component={SettingsPage} data={settingsData} />
}
