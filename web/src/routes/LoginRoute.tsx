import { Route } from "@solidjs/router"
import { Component, lazy } from "solid-js"

const LoginPage = lazy(() => import("../pages/LoginPage.tsx"))

export const LoginRoute: Component = () => {
  return <Route path="/login" component={LoginPage} />
}
