import {
  TransactionsForPopulationQuery,
  TransactionsForPopulationQueryVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"

export const TRANSACTIONS_FOR_POPULATION_QUERY = gql`
  query TransactionsForPopulation {
    transactions(first: 200) {
      nodes {
        id
        shop
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
