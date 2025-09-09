import {
  CreateTransactionMutation,
  CreateTransactionMutationVariables
} from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { FullTransactionFragment } from "../fragments/transactionFragments.ts"
import { GET_TRANSACTION_QUERY } from "../queries/getTransactionQuery.ts"
import { TRANSACTIONS_BY_DAY_QUERY } from "../queries/transactionsByDayQuery.ts"
import { TRANSACTIONS_QUERY } from "../queries/transactionsQuery.ts"

const CREATE_TRANSACTION_MUTATION = gql`
  ${FullTransactionFragment}

  mutation CreateTransaction($input: TransactionInput!) {
    transactionCreate(input: { transactionInput: $input }) {
      transaction {
        ...FullTransaction
      }
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
