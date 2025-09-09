import { SplitTransactionMutation, SplitTransactionMutationVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { GET_TRANSACTION_QUERY } from "../queries/getTransactionQuery.ts"
import { TRANSACTIONS_QUERY } from "../queries/transactionsQuery.ts"

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
