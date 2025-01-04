import { DeleteCategoryMutation, DeleteCategoryMutationVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery.ts"

const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    categoryDelete(input: { id: $id }) {
      category {
        id
      }
    }
  }
`

export const useDeleteCategory = (options: MutationOptions<DeleteCategoryMutation> = {}) =>
  useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DELETE_CATEGORY_MUTATION, {
    refetchQueries: [CATEGORIES_QUERY],
    ...options
  })
