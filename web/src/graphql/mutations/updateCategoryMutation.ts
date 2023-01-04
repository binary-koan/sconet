import { UpdateCategoryMutation, UpdateCategoryMutationVariables } from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery"
import { GET_CATEGORY_QUERY } from "../queries/getCategoryQuery"

const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
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

export const useUpdateCategory = (options: MutationOptions<UpdateCategoryMutation>) =>
  useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UPDATE_CATEGORY_MUTATION, {
    refetchQueries: [CATEGORIES_QUERY, GET_CATEGORY_QUERY],
    ...options
  })
