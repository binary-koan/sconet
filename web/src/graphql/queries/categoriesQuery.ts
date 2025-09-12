import { CategoriesQuery, CategoriesQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
import { FullCategoryFragment } from "../fragments/categoryFragments"

export const CATEGORIES_QUERY = gql`
  ${FullCategoryFragment}

  query Categories($archived: Boolean!, $today: ISO8601Date!) {
    categories(archived: $archived) {
      ...FullCategory
    }
  }
`

export const useCategoriesQuery = (variables: () => CategoriesQueryVariables) =>
  useQuery<CategoriesQuery, CategoriesQueryVariables>(CATEGORIES_QUERY, variables)
