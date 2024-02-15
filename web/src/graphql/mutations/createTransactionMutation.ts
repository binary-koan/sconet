import { CreateTransactionMutation, CreateTransactionMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { FullTransactionFragment } from "../fragments/transactionFragments"
import { GET_TRANSACTION_QUERY } from "../queries/getTransactionQuery"
import { TRANSACTIONS_BY_DAY_QUERY } from "../queries/transactionsByDayQuery"
import { TRANSACTIONS_QUERY } from "../queries/transactionsQuery"

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
