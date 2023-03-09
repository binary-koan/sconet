import { CreateCurrencyMutation, CreateCurrencyMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CURRENCIES_QUERY } from "../queries/currenciesQuery"

const MUTATION = gql`
  mutation CreateCurrency($input: CreateCurrencyInput!) {
    createCurrency(input: $input) {
      id
    }
  }
`

export const useCreateCurrency = (options: MutationOptions<CreateCurrencyMutation> = {}) =>
  useMutation<CreateCurrencyMutation, CreateCurrencyMutationVariables>(MUTATION, {
    refetchQueries: [CURRENCIES_QUERY],
    ...options
  })
