import { GetCategoryQuery, GetCategoryQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
import { FullCategoryFragment } from "../fragments/categoryFragments"

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
