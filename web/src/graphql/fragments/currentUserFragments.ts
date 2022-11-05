import { gql } from "../../utils/gql"

export const FullCurrentUserFragment = gql`
  fragment FullCurrentUser on CurrentUser {
    id
    email
  }
`
