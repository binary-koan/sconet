import { Alert } from "@hope-ui/solid"
import { gql } from "@solid-primitives/graphql"
import { Component, Resource } from "solid-js"
import { FindAccountMailboxesQuery } from "../../graphql-types"
import { Cell } from "../Cell"
import LoadingBar from "../LoadingBar"
import AccountMailboxes from "./AccountMailboxes"

export const ACCOUNT_MAILBOXES_QUERY = gql`
  query FindAccountMailboxes {
    accountMailboxes {
      id
      name
      mailServerOptions
      fromAddressPattern
      datePattern
      memoPattern
      amountPattern
    }
  }
`

const Loading = () => <LoadingBar />

const Failure: Component<{ error: any }> = (props) => (
  <Alert status="danger">{props.error.message}</Alert>
)

const Success: Component<{ data: FindAccountMailboxesQuery }> = (props) => {
  return <AccountMailboxes accountMailboxes={props.data.accountMailboxes} />
}

export const AccountMailboxesCell: Component<{
  data: Resource<FindAccountMailboxesQuery>
}> = (props) => {
  return <Cell data={props.data as any} loading={Loading} failure={Failure} success={Success} />
}
