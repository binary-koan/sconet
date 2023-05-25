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
    }
    currencyCode
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
