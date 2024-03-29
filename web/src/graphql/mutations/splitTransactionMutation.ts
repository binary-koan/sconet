import { SplitTransactionMutation, SplitTransactionMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { GET_TRANSACTION_QUERY } from "../queries/getTransactionQuery"
import { TRANSACTIONS_QUERY } from "../queries/transactionsQuery"

const MUTATION = gql`
  mutation SplitTransaction($id: ID!, $splits: [TransactionSplitItemInput!]!) {
    transactionSplit(input: { id: $id, splits: $splits }) {
      transaction {
        id
      }
    }
  }
`

export const useSplitTransaction = (options: MutationOptions<SplitTransactionMutation> = {}) =>
  useMutation<SplitTransactionMutation, SplitTransactionMutationVariables>(MUTATION, {
    refetchQueries: [TRANSACTIONS_QUERY, GET_TRANSACTION_QUERY],
    ...options
  })
