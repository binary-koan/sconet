import { Alert } from "@hope-ui/solid"
import { Component, Match, onMount, Switch } from "solid-js"
import { FindTransactionsQuery } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { TRANSACTIONS_QUERY } from "../../queries/transactions"
import LoadingBar from "../LoadingBar"
import { TransactionFilterValues } from "./TransactionFilters"
import Transactions from "./Transactions"

const Loading = () => <LoadingBar />

const Empty = () => <div>Empty</div>

const Failure: Component<{ error: any }> = (props) => (
  <Alert status="danger">{props.error.message}</Alert>
)

const Success: Component<{
  data?: FindTransactionsQuery
  fetchMore: (variables: any) => void
  setFilterValues: (values: TransactionFilterValues) => void
  isEditing: boolean
}> = (props) => {
  const doFetchMore = () => {
    props.fetchMore({
      offset: props.data?.transactions.nextOffset
    })
  }

  if (props.data) {
    return (
      <Transactions
        transactions={props.data.transactions.data}
        fetchMore={props.data.transactions.nextOffset ? doFetchMore : undefined}
        setFilterValues={props.setFilterValues}
        isEditing={props.isEditing}
      />
    )
  }
}

export const TransactionsCell: Component<{
  filter: any
  isEditing: boolean
  setFilterValues: (values: Partial<TransactionFilterValues>) => void
}> = (props) => {
  const [data] = useQuery<FindTransactionsQuery>(TRANSACTIONS_QUERY)

  return (
    <Switch>
      <Match when={data.state === "unresolved" || data.state === "pending"}>
        <Loading />
      </Match>
      <Match when={data.state === "errored"}>
        <Failure error={data.error} />
      </Match>
      <Match
        when={
          (data.state === "ready" || data.state === "refreshing") &&
          !data().transactions.data.length
        }
      >
        <Empty />
      </Match>
      <Match when={true}>
        <Success
          data={data()}
          fetchMore={() => {}}
          setFilterValues={props.setFilterValues}
          isEditing={props.isEditing}
        />
      </Match>
    </Switch>
  )
}
