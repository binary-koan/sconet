import { gql } from "@solid-primitives/graphql"
import { createResource, createSignal } from "solid-js"
import { FindTransactionsQuery, FindTransactionsQueryVariables } from "../graphql-types"

export const TRANSACTIONS_QUERY = gql`
  query FindTransactions($limit: Int, $offset: String, $filter: TransactionFilter) {
    transactions(limit: $limit, offset: $offset, filter: $filter) {
      data {
        id
        memo
        date
        originalMemo
        amount
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
          amount
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
