import { SplitTransactionMutation, SplitTransactionMutationVariables } from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { FullTransactionFragment } from "../fragments/transactionFragments"
import { GET_TRANSACTION_QUERY } from "../queries/getTransactionQuery"
import { TRANSACTIONS_QUERY } from "../queries/transactionsQuery"

const SPLIT_TRANSACTION_MUTATION = gql`
  ${FullTransactionFragment}

  mutation SplitTransaction($id: String!, $amounts: [Int!]!) {
    splitTransaction(id: $id, amounts: $amounts) {
      ...FullTransaction
    }
  }
`

export const useSplitTransaction = (options: MutationOptions<SplitTransactionMutation> = {}) =>
  useMutation<SplitTransactionMutation, SplitTransactionMutationVariables>(
    SPLIT_TRANSACTION_MUTATION,
    {
      refetchQueries: [TRANSACTIONS_QUERY, GET_TRANSACTION_QUERY],
      ...options
    }
  )
