import { CreateCategoryMutation, CreateCategoryMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery"

const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CategoryInput!) {
    categoryCreate(input: { categoryInput: $input }) {
      category {
        id
      }
    }
  }
`

export const useCreateCategory = (options: MutationOptions<CreateCategoryMutation> = {}) =>
  useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CREATE_CATEGORY_MUTATION, {
    refetchQueries: [CATEGORIES_QUERY],
    ...options
  })
