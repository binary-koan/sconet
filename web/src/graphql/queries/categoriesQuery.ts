import { CategoriesQuery, CategoriesQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
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
