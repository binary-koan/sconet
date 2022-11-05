import { ReorderCategoriesMutation, ReorderCategoriesMutationVariables } from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery"

const REORDER_CATEGORIES_MUTATION = gql`
  mutation ReorderCategories($orderedIds: [String!]!) {
    reorderCategories(orderedIds: $orderedIds) {
      id
    }
  }
`

export const useReorderCategories = (options: MutationOptions<ReorderCategoriesMutation>) =>
  useMutation<ReorderCategoriesMutation, ReorderCategoriesMutationVariables>(
    REORDER_CATEGORIES_MUTATION,
    {
      refetchQueries: [CATEGORIES_QUERY],
      ...options
    }
  )
