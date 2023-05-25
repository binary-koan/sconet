import { TransactionsByDayQuery, TransactionsByDayQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
import { FullTransactionFragment } from "../fragments/transactionFragments"

export const TRANSACTIONS_BY_DAY_QUERY = gql`
  ${FullTransactionFragment}

  query TransactionsByDay($currencyCode: String, $dateFrom: Date!, $dateUntil: Date!) {
    transactionsByDay(dateFrom: $dateFrom, dateUntil: $dateUntil) {
      date
      totalSpent(currencyCode: $currencyCode) {
        formattedShort
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
