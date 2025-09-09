import {
  ReorderCategoriesMutation,
  ReorderCategoriesMutationVariables
} from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery.ts"

const REORDER_CATEGORIES_MUTATION = gql`
  mutation ReorderCategories($orderedIds: [ID!]!) {
    categoriesReorder(input: { orderedIds: $orderedIds }) {
      categories {
        id
      }
    }
  }
`

export const useReorderCategories = (options: MutationOptions<ReorderCategoriesMutation> = {}) =>
  useMutation<ReorderCategoriesMutation, ReorderCategoriesMutationVariables>(
    REORDER_CATEGORIES_MUTATION,
    {
      refetchQueries: [CATEGORIES_QUERY],
      ...options
    }
  )
