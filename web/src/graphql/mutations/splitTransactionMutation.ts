import { SplitTransactionMutation, SplitTransactionMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { FullTransactionFragment } from "../fragments/transactionFragments"
import { GET_TRANSACTION_QUERY } from "../queries/getTransactionQuery"
import { TRANSACTIONS_QUERY } from "../queries/transactionsQuery"

const MUTATION = gql`
  ${FullTransactionFragment}

  mutation SplitTransaction($id: String!, $splits: [SplitTransactionItem!]!) {
    splitTransaction(id: $id, splits: $splits) {
      ...FullTransaction
    }
  }
`

export const useSplitTransaction = (options: MutationOptions<SplitTransactionMutation> = {}) =>
  useMutation<SplitTransactionMutation, SplitTransactionMutationVariables>(MUTATION, {
    refetchQueries: [TRANSACTIONS_QUERY, GET_TRANSACTION_QUERY],
    ...options
  })
