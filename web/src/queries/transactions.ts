import { gql } from "@solid-primitives/graphql"

export const TRANSACTIONS_QUERY = gql`
  query FindTransactions($limit: Int, $offset: String, $filter: TransactionFilter) {
    transactions(limit: $limit, offset: $offset, filter: $filter) {
      data {
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
      nextOffset
    }
  }
`
