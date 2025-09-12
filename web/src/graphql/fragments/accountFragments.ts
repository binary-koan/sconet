import { gql } from "../../utils/gql"

export const FullAccountFragment = gql`
  fragment FullAccount on Account {
    id
    name
    hasTransactions
    currency {
      id
      code
    }
  }
`
