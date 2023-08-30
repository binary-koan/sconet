import { gql } from "../../utils/gql"

export const FullCategoryFragment = gql`
  fragment FullCategory on Category {
    id
    name
    color
    icon
    budget {
      decimalAmount
      formatted
    }
    budgetCurrency {
      code
    }
    isRegular
    sortOrder
    createdAt
    updatedAt
  }
`
