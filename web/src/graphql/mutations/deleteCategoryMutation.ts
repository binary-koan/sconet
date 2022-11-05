import { DeleteCategoryMutation, DeleteCategoryMutationVariables } from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery"

const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      id
    }
  }
`

export const useDeleteCategory = (options: MutationOptions<DeleteCategoryMutation>) =>
  useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DELETE_CATEGORY_MUTATION, {
    refetchQueries: [CATEGORIES_QUERY],
    ...options
  })
