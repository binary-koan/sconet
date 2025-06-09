import { CategoriesQuery, CategoriesQueryVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { useQuery } from "../../utils/graphqlClient/useQuery.ts"
import { FullCategoryFragment } from "../fragments/categoryFragments.ts"

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
