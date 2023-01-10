import { TransactionsByDayQuery, TransactionsByDayQueryVariables } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { FullTransactionFragment } from "../fragments/transactionFragments"

export const TRANSACTIONS_BY_DAY_QUERY = gql`
  ${FullTransactionFragment}

  query TransactionsByDay($dateFrom: Date!, $dateUntil: Date!) {
    transactionsByDay(dateFrom: $dateFrom, dateUntil: $dateUntil) {
      date
      totalSpent {
        formatted
      }
      transactions {
        ...FullTransaction
      }
    }
  }
`

export const useTransactionsByDayQuery = (variables: () => TransactionsByDayQueryVariables) =>
  useQuery<TransactionsByDayQuery, TransactionsByDayQueryVariables>(
    TRANSACTIONS_BY_DAY_QUERY,
    variables
  )
