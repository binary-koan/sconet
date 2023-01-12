import { CreateTransactionMutation, CreateTransactionMutationVariables } from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { GET_TRANSACTION_QUERY } from "../queries/getTransactionQuery"
import { TRANSACTIONS_BY_DAY_QUERY } from "../queries/transactionsByDayQuery"
import { TRANSACTIONS_QUERY } from "../queries/transactionsQuery"

const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
    }
  }
`

export const useCreateTransaction = (options: MutationOptions<CreateTransactionMutation> = {}) =>
  useMutation<CreateTransactionMutation, CreateTransactionMutationVariables>(
    CREATE_TRANSACTION_MUTATION,
    {
      refetchQueries: [TRANSACTIONS_QUERY, TRANSACTIONS_BY_DAY_QUERY, GET_TRANSACTION_QUERY],
      ...options
    }
  )
