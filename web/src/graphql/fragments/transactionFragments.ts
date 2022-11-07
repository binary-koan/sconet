import { gql } from "../../utils/gql"

export const FullTransactionFragment = gql`
  fragment FullTransaction on Transaction {
    id
    memo
    date
    originalMemo
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
    accountMailbox {
      id
      name
    }
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
