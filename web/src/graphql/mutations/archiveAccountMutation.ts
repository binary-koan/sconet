import { ArchiveAccountMutation, ArchiveAccountMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { ACCOUNTS_QUERY } from "../queries/accountsQuery"

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
