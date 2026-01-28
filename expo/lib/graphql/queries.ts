import { gql } from "@apollo/client/core"
import { useQuery } from "@apollo/client/react"
import { TransactionsQuery, TransactionsQueryVariables } from "./types"

const LISTING_TRANSACTION_FRAGMENT = gql`
  fragment ListingTransaction on Transaction {
    id
    shop
    memo
    date

    amount {
      amountDecimal
      formatted
    }
    currency {
      id
    }

    shopAmount {
      amountDecimal
      formatted
    }
    shopCurrency {
      id
    }

    includeInReports
    category {
      id
      name
      color
      icon
    }
    account {
      id
      name
      currency {
        id
      }
    }
    splitTo {
      id
      memo
      amount {
        amountDecimal
        formatted
      }
      shopAmount {
        amountDecimal
        formatted
      }
      category {
        id
        name
        icon
        color
      }
      includeInReports
    }
  }
`

export const TRANSACTIONS_QUERY = gql`
  ${LISTING_TRANSACTION_FRAGMENT}

  query Transactions($limit: Int, $offset: String, $filter: TransactionFilterInput) {
    transactions(first: $limit, after: $offset, filter: $filter) {
      nodes {
        ...ListingTransaction
      }
      pageInfo {
        endCursor
      }
    }
  }
`

export function useTransactionsQuery(variables?: TransactionsQueryVariables) {
  return useQuery<TransactionsQuery, TransactionsQueryVariables>(TRANSACTIONS_QUERY, {
    variables
  })
}
