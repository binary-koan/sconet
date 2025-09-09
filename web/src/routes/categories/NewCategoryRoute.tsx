import { Route } from "@solidjs/router"
import { Component, lazy } from "solid-js"

const NewCategoryPage = lazy(() => import("../../pages/categories/NewCategoryPage.tsx"))

export const NewCategoryRoute: Component = () => {
  return <Route path="/categories/new" component={NewCategoryPage} />
}
