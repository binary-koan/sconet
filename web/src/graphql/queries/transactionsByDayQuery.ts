import { TransactionsByDayQuery, TransactionsByDayQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
import { ListingTransactionFragment } from "../fragments/transactionFragments"

export const TRANSACTIONS_BY_DAY_QUERY = gql`
  ${ListingTransactionFragment}

  query TransactionsByDay($currencyCode: CurrencyCode, $dateFrom: Date!, $dateUntil: Date!) {
    transactionsByDay(dateFrom: $dateFrom, dateUntil: $dateUntil) {
      date
      totalSpent(currencyCode: $currencyCode) {
        formattedShort
      }
      transactions {
        ...ListingTransaction
      }
    }
  }
`

export const useTransactionsByDayQuery = (variables: () => TransactionsByDayQueryVariables) =>
  useQuery<TransactionsByDayQuery, TransactionsByDayQueryVariables>(
    TRANSACTIONS_BY_DAY_QUERY,
    variables
  )
