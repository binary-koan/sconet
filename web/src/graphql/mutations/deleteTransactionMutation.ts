import {
  DeleteTransactionMutation,
  DeleteTransactionMutationVariables
} from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { GET_TRANSACTION_QUERY } from "../queries/getTransactionQuery.ts"
import { TRANSACTIONS_QUERY } from "../queries/transactionsQuery.ts"

const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: ID!) {
    transactionDelete(input: { id: $id }) {
      transaction {
        id
      }
    }
  }
`

export const useDeleteTransaction = (options: MutationOptions<DeleteTransactionMutation> = {}) =>
  useMutation<DeleteTransactionMutation, DeleteTransactionMutationVariables>(
    DELETE_TRANSACTION_MUTATION,
    {
      refetchQueries: [TRANSACTIONS_QUERY, GET_TRANSACTION_QUERY],
      ...options
    }
  )
