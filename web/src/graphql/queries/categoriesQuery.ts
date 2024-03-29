import { CategoriesQuery, CategoriesQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
import { FullCategoryFragment } from "../fragments/categoryFragments"

export const CATEGORIES_QUERY = gql`
  ${FullCategoryFragment}

  query Categories($today: ISO8601Date!) {
    categories {
      ...FullCategory
    }
  }
`

export const useCategoriesQuery = (variables: () => CategoriesQueryVariables) =>
  useQuery<CategoriesQuery, CategoriesQueryVariables>(CATEGORIES_QUERY, variables)
