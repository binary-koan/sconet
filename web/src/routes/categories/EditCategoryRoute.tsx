import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useGetCategoryQuery } from "../../graphql/queries/getCategoryQuery"
import { EditCategoryPageData } from "../../pages/categories/EditCategoryPage"

const editCategoryData: RouteDataFunc<unknown, EditCategoryPageData> = ({ params }) => {
  const [data] = useGetCategoryQuery(() => ({ id: params.id }))

  return { data }
}

const EditCategoryPage = lazy(() => import("../../pages/categories/EditCategoryPage"))

export const EditCategoryRoute: Component = () => {
  return <Route path="/categories/:id" component={EditCategoryPage} data={editCategoryData} />
}
