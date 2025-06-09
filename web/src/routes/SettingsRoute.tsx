import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useCurrentUserQuery } from "../graphql/queries/currentUserQuery.ts"
import { SettingsPageData } from "../pages/SettingsPage.tsx"

const settingsData: RouteDataFunc<unknown, SettingsPageData> = () => {
  const currentUser = useCurrentUserQuery()

  return { currentUser }
}

const SettingsPage = lazy(() => import("../pages/SettingsPage.tsx"))

export const SettingsRoute: Component = () => {
  return <Route path="/settings" component={SettingsPage} data={settingsData} />
}
