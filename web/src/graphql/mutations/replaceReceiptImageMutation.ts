import {
  ReplaceReceiptImageMutation,
  ReplaceReceiptImageMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { GET_TRANSACTION_QUERY } from "../queries/getTransactionQuery"
import { UNCONFIRMED_TRANSACTIONS_QUERY } from "../queries/unconfirmedTransactionsQuery"

const REPLACE_RECEIPT_IMAGE_MUTATION = gql`
  mutation ReplaceReceiptImage($id: ID!, $image: Upload!) {
    receiptImageReplace(input: { id: $id, image: $image }) {
      transaction {
        id
      }
    }
  }
`

export const useReplaceReceiptImage = (
  options: MutationOptions<ReplaceReceiptImageMutation> = {}
) =>
  useMutation<ReplaceReceiptImageMutation, ReplaceReceiptImageMutationVariables>(
    REPLACE_RECEIPT_IMAGE_MUTATION,
    {
      refetchQueries: [GET_TRANSACTION_QUERY, UNCONFIRMED_TRANSACTIONS_QUERY],
      ...options
    }
  )
