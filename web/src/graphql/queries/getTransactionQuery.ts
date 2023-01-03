import { GetTransactionQuery, GetTransactionQueryVariables } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { FullTransactionFragment } from "../fragments/transactionFragments"

export const GET_TRANSACTION_QUERY = gql`
  ${FullTransactionFragment}

  query GetTransaction($id: String!) {
    transaction(id: $id) {
      ...FullTransaction
    }
  }
`

export const useGetTransactionQuery = (variables: () => GetTransactionQueryVariables) =>
  useQuery<GetTransactionQuery, GetTransactionQueryVariables>(GET_TRANSACTION_QUERY, variables)
