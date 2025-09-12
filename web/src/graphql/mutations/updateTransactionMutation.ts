import { UpdateTransactionMutation, UpdateTransactionMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { GET_TRANSACTION_QUERY } from "../queries/getTransactionQuery"
import { TRANSACTIONS_QUERY } from "../queries/transactionsQuery"

const UPDATE_TRANSACTION_MUTATION = gql`
  mutation UpdateTransaction($id: ID!, $input: TransactionInput!) {
    transactionUpdate(input: { id: $id, transactionInput: $input }) {
      transaction {
        id
      }
    }
  }
`

export const useUpdateTransaction = (options: MutationOptions<UpdateTransactionMutation> = {}) =>
  useMutation<UpdateTransactionMutation, UpdateTransactionMutationVariables>(
    UPDATE_TRANSACTION_MUTATION,
    {
      refetchQueries: [TRANSACTIONS_QUERY, GET_TRANSACTION_QUERY],
      ...options
    }
  )
