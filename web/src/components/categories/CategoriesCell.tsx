import { Alert } from "@hope-ui/solid"
import { gql } from "@solid-primitives/graphql"
import { Component, Resource } from "solid-js"
import { FindCategoriesQuery } from "../../graphql-types"
import { Cell } from "../Cell"
import LoadingBar from "../LoadingBar"
import Categories from "./Categories"

export const CATEGORIES_QUERY = gql`
  query FindCategories {
    categories {
      id
      name
      color
      icon
      budget {
        formatted
      }
      isRegular
      sortOrder
      createdAt
      updatedAt
    }
  }
`

const Loading = () => <LoadingBar />

const Failure: Component<{ error: any }> = (props) => (
  <Alert status="danger">{props.error.message}</Alert>
)

const Success: Component<{ data: FindCategoriesQuery }> = (props) => {
  return <Categories categories={props.data.categories} />
}

export const CategoriesCell: Component<{
  data: Resource<FindCategoriesQuery>
}> = (props) => {
  return <Cell data={props.data as any} loading={Loading} failure={Failure} success={Success} />
}
