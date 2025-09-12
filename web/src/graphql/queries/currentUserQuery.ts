import { CurrentUserQuery, CurrentUserQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
import { FullCurrentUserFragment } from "../fragments/currentUserFragments"

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
