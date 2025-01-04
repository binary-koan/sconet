import { ArchiveCategoryMutation, ArchiveCategoryMutationVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery.ts"

const ARCHIVE_CATEGORY_MUTATION = gql`
  mutation ArchiveCategory($id: ID!) {
    categoryArchive(input: { id: $id }) {
      category {
        id
      }
    }
  }
`

export const useArchiveCategory = (options: MutationOptions<ArchiveCategoryMutation> = {}) =>
  useMutation<ArchiveCategoryMutation, ArchiveCategoryMutationVariables>(
    ARCHIVE_CATEGORY_MUTATION,
    {
      refetchQueries: [CATEGORIES_QUERY],
      ...options
    }
  )
