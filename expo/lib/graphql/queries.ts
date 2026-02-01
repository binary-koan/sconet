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
      emoji
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
        color
        emoji
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

// Categories Query
export interface CategoriesQuery {
  categories: {
    id: string
    name: string
    color: string
    emoji: string | null
  }[]
}

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
      color
      emoji
    }
  }
`

export function useCategoriesQuery() {
  return useQuery<CategoriesQuery>(CATEGORIES_QUERY)
}

// Accounts Query
export interface AccountsQuery {
  accounts: {
    id: string
    name: string
    currency: {
      id: string
      code: string
      symbol: string
    }
  }[]
}

export const ACCOUNTS_QUERY = gql`
  query Accounts {
    accounts {
      id
      name
      currency {
        id
        code
        symbol
      }
    }
  }
`

export function useAccountsQuery() {
  return useQuery<AccountsQuery>(ACCOUNTS_QUERY)
}
