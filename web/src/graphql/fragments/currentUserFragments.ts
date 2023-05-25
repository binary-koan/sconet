import { gql } from "../../utils/gql"
import { FullCurrencyFragment } from "./currencyFragments"

export const FullCurrentUserFragment = gql`
  ${FullCurrencyFragment}

  fragment FullCurrentUser on CurrentUser {
    id
    email

    defaultCurrency {
      ...FullCurrency
    }

    favoriteCurrencies {
      ...FullCurrency
    }

    registeredCredentials {
      id
      device
      createdAt
    }
  }
`
