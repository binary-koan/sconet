import { gql } from "../../utils/gql"

export const FullTransactionFragment = gql`
  fragment FullTransaction on Transaction {
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
      decimalDigits
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
        code
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

export const ListingTransactionFragment = gql`
  fragment ListingTransaction on Transaction {
    id
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
