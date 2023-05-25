import { gql } from "../../utils/gql"

export const FullCurrencyFragment = gql`
  fragment FullCurrency on Currency {
    code
    name
    symbol
    decimalDigits
  }
`
