import { Route, RouteDataFunc } from "@solidjs/router"
import { Component, lazy } from "solid-js"
import { useGetCategoryQuery } from "../../graphql/queries/getCategoryQuery.ts"
import { EditCategoryPageData } from "../../pages/categories/EditCategoryPage.tsx"
import { stripTime } from "../../utils/date.ts"

const editCategoryData: RouteDataFunc<unknown, EditCategoryPageData> = ({ params }) => {
  const data = useGetCategoryQuery(() => ({ id: params.id, today: stripTime(new Date()) }))

  return { data }
}

const EditCategoryPage = lazy(() => import("../../pages/categories/EditCategoryPage.tsx"))

export const EditCategoryRoute: Component = () => {
  return <Route path="/categories/:id" component={EditCategoryPage} data={editCategoryData} />
}
