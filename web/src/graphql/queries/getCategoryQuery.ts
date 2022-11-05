import { GetCategoryQueryVariables, GetCategoryQuery } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { gql } from "../../utils/gql"

export const GET_CATEGORY_QUERY = gql`
  query GetCategory($id: String!) {
    category: category(id: $id) {
      id
      name
      color
      icon
      budget {
        decimalAmount
        formatted
      }
      createdAt
      updatedAt
    }
  }
`

export const useGetCategoryQuery = (variables: () => GetCategoryQueryVariables) =>
  useQuery<GetCategoryQuery, GetCategoryQueryVariables>(GET_CATEGORY_QUERY, variables)
