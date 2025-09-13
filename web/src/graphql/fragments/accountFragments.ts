import { gql } from "../../utils/gql"

export const FullAccountFragment = gql`
  fragment FullAccount on Account {
    id
    name
    hasTransactions
    favourite
    currency {
      id
      code
    }
  }
`
