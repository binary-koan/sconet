import { CurrentUserQuery, CurrentUserQueryVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { useQuery } from "../../utils/graphqlClient/useQuery.ts"
import { FullCurrentUserFragment } from "../fragments/currentUserFragments.ts"

export const CURRENT_USER_QUERY = gql`
  ${FullCurrentUserFragment}

  query CurrentUser {
    currentUser {
      ...FullCurrentUser
    }
  }
`

export const useCurrentUserQuery = () =>
  useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CURRENT_USER_QUERY)
