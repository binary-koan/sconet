import { gql } from "../../utils/gql"

export const FullCurrencyFragment = gql`
  fragment FullCurrency on Currency {
    id
    code
    name
    symbol
    decimalDigits
  }
`
