import { gql } from "../../utils/gql"

export const FullCategoryFragment = gql`
  fragment FullCategory on Category {
    id
    name
    color
    icon
    budget {
      formatted
    }
    isRegular
    sortOrder
    createdAt
    updatedAt
  }
`
