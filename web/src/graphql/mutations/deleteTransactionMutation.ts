import { DeleteTransactionMutation, DeleteTransactionMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { GET_TRANSACTION_QUERY } from "../queries/getTransactionQuery"
import { TRANSACTIONS_QUERY } from "../queries/transactionsQuery"

const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: String!) {
    deleteTransaction(id: $id) {
      id
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
