import { Route, RouteDataFunc, useRouteData } from "@solidjs/router"
import { Component, Resource } from "solid-js"
import { EditCategoryCell, EDIT_CATEGORY_QUERY } from "../components/categories/EditCategoryCell"
import { EditCategoryByIdQuery } from "../graphql-types"
import { useQuery } from "../graphqlClient"

type EditCategoryPageData = Resource<EditCategoryByIdQuery>

const EditCategory: Component = () => {
  const data = useRouteData<() => EditCategoryPageData>()

  return <EditCategoryCell data={data} />
}

const editCategoryData: RouteDataFunc = ({ params }) => {
  const [data] = useQuery<EditCategoryByIdQuery>(EDIT_CATEGORY_QUERY, () => ({ id: params.id }))

  return data
}

export const EditCategoryRoute: Component = () => {
  return <Route path="/categories/:id" component={EditCategory} data={editCategoryData} />
}
