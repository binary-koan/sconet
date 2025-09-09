import {
  TransactionsForPopulationQuery,
  TransactionsForPopulationQueryVariables
} from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { useQuery } from "../../utils/graphqlClient/useQuery.ts"

export const TRANSACTIONS_FOR_POPULATION_QUERY = gql`
  query TransactionsForPopulation {
    transactions(first: 200) {
      nodes {
        id
        shop
        memo
        account {
          id
          currency {
            id
          }
        }
        category {
          id
        }
      }
    }
  }
`

export const useTransactionsForPopulationQuery = () =>
  useQuery<TransactionsForPopulationQuery, TransactionsForPopulationQueryVariables>(
    TRANSACTIONS_FOR_POPULATION_QUERY,
    () => ({})
  )
