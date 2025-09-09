import { CreateCategoryMutation, CreateCategoryMutationVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery.ts"

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
