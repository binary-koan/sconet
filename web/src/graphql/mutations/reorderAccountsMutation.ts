import { ReorderAccountsMutation, ReorderAccountsMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { ACCOUNTS_QUERY } from "../queries/accountsQuery"

const REORDER_ACCOUNTS_MUTATION = gql`
  mutation ReorderAccounts($orderedIds: [ID!]!) {
    accountsReorder(input: { orderedIds: $orderedIds }) {
      accounts {
        id
      }
    }
  }
`

export const useReorderAccounts = (options: MutationOptions<ReorderAccountsMutation> = {}) =>
  useMutation<ReorderAccountsMutation, ReorderAccountsMutationVariables>(
    REORDER_ACCOUNTS_MUTATION,
    {
      refetchQueries: [ACCOUNTS_QUERY],
      ...options
    }
  )
