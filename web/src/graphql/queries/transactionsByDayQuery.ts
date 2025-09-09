import { TransactionsByDayQuery, TransactionsByDayQueryVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { useQuery } from "../../utils/graphqlClient/useQuery.ts"
import { ListingTransactionFragment } from "../fragments/transactionFragments.ts"

export const TRANSACTIONS_BY_DAY_QUERY = gql`
  ${ListingTransactionFragment}

  query TransactionsByDay($currencyId: ID, $dateFrom: ISO8601Date!, $dateUntil: ISO8601Date!) {
    transactionsByDay(dateFrom: $dateFrom, dateUntil: $dateUntil) {
      date
      totalSpent(currencyId: $currencyId) {
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
