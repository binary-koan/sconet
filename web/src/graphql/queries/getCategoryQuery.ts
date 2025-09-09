import { GetCategoryQuery, GetCategoryQueryVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { useQuery } from "../../utils/graphqlClient/useQuery.ts"
import { FullCategoryFragment } from "../fragments/categoryFragments.ts"

export const GET_CATEGORY_QUERY = gql`
  ${FullCategoryFragment}

  query GetCategory($id: ID!, $today: ISO8601Date!) {
    category(id: $id) {
      ...FullCategory
    }
  }
`

export const useGetCategoryQuery = (variables: () => GetCategoryQueryVariables) =>
  useQuery<GetCategoryQuery, GetCategoryQueryVariables>(GET_CATEGORY_QUERY, variables)
