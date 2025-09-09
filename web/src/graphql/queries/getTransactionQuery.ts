import { GetTransactionQuery, GetTransactionQueryVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { useQuery } from "../../utils/graphqlClient/useQuery.ts"
import { FullTransactionFragment } from "../fragments/transactionFragments.ts"

export const GET_TRANSACTION_QUERY = gql`
  ${FullTransactionFragment}

  query GetTransaction($id: ID!) {
    transaction(id: $id) {
      ...FullTransaction
    }
  }
`

export const useGetTransactionQuery = (variables: () => GetTransactionQueryVariables) =>
  useQuery<GetTransactionQuery, GetTransactionQueryVariables>(GET_TRANSACTION_QUERY, variables)
