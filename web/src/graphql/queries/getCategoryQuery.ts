import { GetCategoryQuery, GetCategoryQueryVariables } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { FullCategoryFragment } from "../fragments/categoryFragments"

export const GET_CATEGORY_QUERY = gql`
  ${FullCategoryFragment}

  query GetCategory($id: String!) {
    category(id: $id) {
      ...FullCategory
    }
  }
`

export const useGetCategoryQuery = (variables: () => GetCategoryQueryVariables) =>
  useQuery<GetCategoryQuery, GetCategoryQueryVariables>(GET_CATEGORY_QUERY, variables)
