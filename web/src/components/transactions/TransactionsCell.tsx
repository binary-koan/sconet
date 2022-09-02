import { Alert } from "@hope-ui/solid"
import { gql } from "@solid-primitives/graphql"
import { Component } from "solid-js"
import { FindTransactionsQuery, FindTransactionsQueryVariables } from "../../graphql-types"
import { createQuery } from "../../graphqlClient"
import LoadingBar from "../LoadingBar"
import { TransactionFilterValues } from "./TransactionFilters"
import Transactions from "./Transactions"

const query = gql`
  query FindTransactions($limit: Int, $offset: String, $filter: TransactionFilter) {
    transactions(limit: $limit, offset: $offset, filter: $filter) {
      data {
        id
        memo
        date
        originalMemo
        amount
        includeInReports
        category {
          id
          name
          color
          icon
        }
        accountMailbox {
          id
          name
        }
        splitTo {
          id
          memo
          amount
          category {
            id
            name
            icon
            color
          }
          includeInReports
        }
      }
      nextOffset
    }
  }
`

const Loading = () => <LoadingBar />

const Empty = () => <div>Empty</div>

const Failure: Component<{ error: any }> = (props) => (
  <Alert status="danger">{props.error.message}</Alert>
)

const Success = ({
  data,
  fetchMore,
  setFilterValues,
  isEditing
}: {
  data?: FindTransactionsQuery
  fetchMore: (variables: any) => void
  setFilterValues: (values: TransactionFilterValues) => void
  isEditing: boolean
}) => {
  const doFetchMore = () => {
    fetchMore({
      offset: data?.transactions.nextOffset
    })
  }

  if (data) {
    return (
      <Transactions
        transactions={data.transactions.data}
        fetchMore={data.transactions.nextOffset ? doFetchMore : undefined}
        setFilterValues={setFilterValues}
        isEditing={isEditing}
      />
    )
  }
}

export const TransactionsCell: Component<{
  filter: any
  isEditing: boolean
  setFilterValues: (values: Partial<TransactionFilterValues>) => void
}> = (props) => {
  const [data] = createQuery<FindTransactionsQuery, FindTransactionsQueryVariables>(query)

  switch (data.state) {
    case "unresolved":
    case "pending":
      return <Loading />
    case "errored":
      return <Failure error={data.error} />
    case "ready":
    case "refreshing":
      return (
        <Success
          data={data()}
          fetchMore={() => {}}
          setFilterValues={props.setFilterValues}
          isEditing={props.isEditing}
        />
      )
  }
}
