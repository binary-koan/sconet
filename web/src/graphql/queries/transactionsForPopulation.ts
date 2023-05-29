import {
  TransactionsForPopulationQuery,
  TransactionsForPopulationQueryVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"

export const TRANSACTIONS_FOR_POPULATION_QUERY = gql`
  query TransactionsForPopulation {
    transactions(limit: 200) {
      data {
        id
        memo
        accountId
        categoryId
      }
    }
  }
`

export const useTransactionsForPopulationQuery = () =>
  useQuery<TransactionsForPopulationQuery, TransactionsForPopulationQueryVariables>(
    TRANSACTIONS_FOR_POPULATION_QUERY,
    () => ({})
  )
