import { ArchiveAccountMutation, ArchiveAccountMutationVariables } from "../../graphql-types.ts "
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { ACCOUNTS_QUERY } from "../queries/accountsQuery.ts"

const ARCHIVE_ACCOUNT_MUTATION = gql`
  mutation ArchiveAccount($id: ID!) {
    accountArchive(input: { id: $id }) {
      account {
        id
      }
    }
  }
`

export const useArchiveAccount = (options: MutationOptions<ArchiveAccountMutation> = {}) =>
  useMutation<ArchiveAccountMutation, ArchiveAccountMutationVariables>(ARCHIVE_ACCOUNT_MUTATION, {
    refetchQueries: [ACCOUNTS_QUERY],
    ...options
  })
