import { gql } from "../../utils/gql"

export const FullAccountMailboxFragment = gql`
  fragment FullAccountMailbox on AccountMailbox {
    id
    name
    mailServerOptions
    fromAddressPattern
    datePattern
    memoPattern
    amountPattern
  }
`
