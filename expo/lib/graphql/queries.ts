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
        color
        icon
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
    icon: string | null
  }[]
}

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
      color
      icon
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

export interface CurrentUserQuery {
  currentUser: {
    id: string
    defaultAccount?: {
      id: string
      currency: {
        id: string
      }
    } | null
  }
}

export const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      defaultAccount {
        id
        currency {
          id
        }
      }
    }
  }
`

export function useCurrentUserQuery() {
  return useQuery<CurrentUserQuery>(CURRENT_USER_QUERY)
}

// Single Transaction Query
export interface TransactionQuery {
  transaction: {
    id: string
    shop: string
    memo?: string
    date: string
    amount?: {
      amountDecimal: number
      formatted: string
    }
    currency?: {
      id: string
      code: string
      symbol: string
    }
    shopAmount?: {
      amountDecimal: number
      formatted: string
    }
    includeInReports: boolean
    category?: {
      id: string
      name: string
      color: string
      icon: string | null
    }
    account: {
      id: string
      name: string
      currency: {
        id: string
        code: string
        symbol: string
      }
    }
    splitTo?: {
      id: string
      memo?: string
      amount?: {
        amountDecimal: number
        formatted: string
      }
      category?: {
        id: string
        name: string
        color: string
        icon: string | null
      }
      includeInReports: boolean
    }[]
  }
}

export interface TransactionQueryVariables {
  id: string
}

export const TRANSACTION_QUERY = gql`
  query Transaction($id: ID!) {
    transaction(id: $id) {
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
        code
        symbol
      }
      shopAmount {
        amountDecimal
        formatted
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
          code
          symbol
        }
      }
      splitTo {
        id
        memo
        amount {
          amountDecimal
          formatted
        }
        category {
          id
          name
          color
          icon
        }
        includeInReports
      }
    }
  }
`

export function useTransactionQuery(variables: TransactionQueryVariables) {
  return useQuery<TransactionQuery, TransactionQueryVariables>(TRANSACTION_QUERY, {
    variables
  })
}
