import { CreateCurrencyMutation, CreateCurrencyMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CURRENCIES_QUERY } from "../queries/currenciesQuery"

const CREATE_CURRENCY_MUTATION = gql`
  mutation CreateCurrency($input: CurrencyCreateInput!) {
    currencyCreate(input: $input) {
      currency {
        id
      }
    }
  }
`

export const useCreateCurrency = (options: MutationOptions<CreateCurrencyMutation> = {}) =>
  useMutation<CreateCurrencyMutation, CreateCurrencyMutationVariables>(CREATE_CURRENCY_MUTATION, {
    refetchQueries: [CURRENCIES_QUERY],
    ...options
  })
