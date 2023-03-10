import { UpdateCategoryMutation, UpdateCategoryMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { FullCategoryFragment } from "../fragments/categoryFragments"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery"
import { GET_CATEGORY_QUERY } from "../queries/getCategoryQuery"

const UPDATE_CATEGORY_MUTATION = gql`
  ${FullCategoryFragment}

  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...FullCategory
    }
  }
`

export const useUpdateCategory = (options: MutationOptions<UpdateCategoryMutation> = {}) =>
  useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UPDATE_CATEGORY_MUTATION, {
    refetchQueries: [CATEGORIES_QUERY, GET_CATEGORY_QUERY],
    ...options
  })
