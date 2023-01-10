import { UpdateCategoryMutation, UpdateCategoryMutationVariables } from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { FullCategoryFragment } from "../fragments/categoryFragments"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery"
import { GET_CATEGORY_QUERY } from "../queries/getCategoryQuery"

const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    ${FullCategoryFragment}

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
