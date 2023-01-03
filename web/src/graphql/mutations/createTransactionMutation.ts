import { CreateTransactionMutation, CreateTransactionMutationVariables } from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { TRANSACTIONS_QUERY } from "../queries/transactionsQuery"

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
    }
  }
`

export const useCreateTransaction = (options: MutationOptions<CreateTransactionMutation>) =>
  useMutation<CreateTransactionMutation, CreateTransactionMutationVariables>(
    CREATE_TRANSACTION_MUTATION,
    {
      refetchQueries: [TRANSACTIONS_QUERY],
      ...options
    }
  )
