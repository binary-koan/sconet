import { UpdateCategoryMutation, UpdateCategoryMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery"
import { GET_CATEGORY_QUERY } from "../queries/getCategoryQuery"

const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    categoryUpdate(input: { id: $id, categoryInput: $input }) {
      category {
        id
      }
    }
  }
`

export const useUpdateCategory = (options: MutationOptions<UpdateCategoryMutation> = {}) =>
  useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UPDATE_CATEGORY_MUTATION, {
    refetchQueries: [CATEGORIES_QUERY, GET_CATEGORY_QUERY],
    ...options
  })
