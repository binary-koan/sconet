import { Route } from "@solidjs/router"
import { Component, lazy } from "solid-js"

const LoginPage = lazy(() => import("../pages/LoginPage"))

export const LoginRoute: Component = () => {
  return <Route path="/login" component={LoginPage} />
}
