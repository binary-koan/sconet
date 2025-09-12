import { ArchiveCategoryMutation, ArchiveCategoryMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CATEGORIES_QUERY } from "../queries/categoriesQuery"

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
