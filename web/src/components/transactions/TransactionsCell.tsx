import { Alert } from "@hope-ui/solid"
import { Component, Resource } from "solid-js"
import { FindTransactionsQuery } from "../../graphql-types"
import { Cell } from "../Cell"
import LoadingBar from "../LoadingBar"
import { TransactionFilterValues } from "./TransactionFilters"
import Transactions from "./Transactions"

const Loading = () => <LoadingBar />

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
  data: Resource<FindTransactionsQuery>
  filter: any
  isEditing: boolean
  setFilterValues: (values: Partial<TransactionFilterValues>) => void
}> = (props) => {
  return (
    <Cell
      data={props.data as any}
      loading={Loading}
      failure={Failure}
      success={Success}
      fetchMore={() => {}}
      setFilterValues={props.setFilterValues}
      isEditing={props.isEditing}
    />
  )
}
