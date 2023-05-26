import { gql } from "../../utils/gql"

export const FullTransactionFragment = gql`
  fragment FullTransaction on Transaction {
    id
    memo
    date

    amount {
      decimalAmount
      formatted
    }
    currencyCode
    currency {
      code
      symbol
      decimalDigits
    }

    originalAmount {
      decimalAmount
      formatted
    }
    originalCurrencyCode

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
      currencyCode
    }
    splitFromId
    splitTo {
      id
      memo
      amount {
        decimalAmount
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

export const ListingTransactionFragment = gql`
  fragment ListingTransaction on Transaction {
    id
    memo
    date

    amount {
      decimalAmount
      formatted
    }
    currencyCode

    originalAmount {
      decimalAmount
      formatted
    }
    originalCurrencyCode

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
      currencyCode
    }
    splitFromId
    splitTo {
      id
      memo
      amount {
        decimalAmount
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
