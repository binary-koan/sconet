import { UpdateTransactionMutation, UpdateTransactionMutationVariables } from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { GET_TRANSACTION_QUERY } from "../queries/getTransactionQuery"
import { TRANSACTIONS_QUERY } from "../queries/transactionsQuery"

export const UPDATE_TRANSACTION_MUTATION = gql`
  mutation UpdateTransaction($id: String!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
    }
  }
`

export const useUpdateTransaction = (options: MutationOptions<UpdateTransactionMutation>) =>
  useMutation<UpdateTransactionMutation, UpdateTransactionMutationVariables>(
    UPDATE_TRANSACTION_MUTATION,
    {
      refetchQueries: [TRANSACTIONS_QUERY, GET_TRANSACTION_QUERY],
      ...options
    }
  )
