import { CategoriesQuery, CategoriesQueryVariables } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { FullCategoryFragment } from "../fragments/categoryFragments"

export const CATEGORIES_QUERY = gql`
  ${FullCategoryFragment}

  query Categories {
    categories {
      ...FullCategory
    }
  }
`

export const useCategoriesQuery = () =>
  useQuery<CategoriesQuery, CategoriesQueryVariables>(CATEGORIES_QUERY)
