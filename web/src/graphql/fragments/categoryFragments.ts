import { gql } from "../../utils/gql"

export const FullCategoryFragment = gql`
  fragment FullCategory on Category {
    id
    name
    color
    icon
    budget(date: $today) {
      budget {
        amountDecimal
        formatted
      }
      currency {
        id
      }
    }
    isRegular
    sortOrder
    createdAt
    updatedAt
  }
`
