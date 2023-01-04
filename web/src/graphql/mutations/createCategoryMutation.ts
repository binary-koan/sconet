import {
  CreateCategoryMutation,
  CreateCategoryMutationVariables
} from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery"

const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
    }
  }
`

export const useCreateCategory = (options: MutationOptions<CreateCategoryMutation>) =>
  useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(
    CREATE_CATEGORY_MUTATION,
    {
      refetchQueries: [CATEGORIES_QUERY],
      ...options
    }
  )
