import { gql } from "../../utils/gql.ts"

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
