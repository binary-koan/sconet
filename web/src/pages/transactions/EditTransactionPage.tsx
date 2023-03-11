import { useNavigate, useRouteData } from "@solidjs/router"
import { Component } from "solid-js"
import toast from "solid-toast"
import { Cell } from "../../components/Cell"
import InnerPageWrapper from "../../components/InnerPageWrapper"
import TransactionForm from "../../components/transactions/TransactionForm"
import {
  GetTransactionQuery,
  GetTransactionQueryVariables,
  UpdateTransactionInput
} from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { QueryResource } from "../../utils/graphqlClient/useQuery"

export interface EditTransactionPageData {
  data: QueryResource<GetTransactionQuery, GetTransactionQueryVariables>
}

const EditTransactionPage: Component = () => {
  const routeData = useRouteData<EditTransactionPageData>()
  const navigate = useNavigate()

  const updateTransaction = useUpdateTransaction({
    onSuccess: () => {
      toast.success("Transaction updated")
      navigate("/transactions")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSave = (input: UpdateTransactionInput) => {
    updateTransaction({ id: routeData.data()!.transaction!.id, input })
  }

  return (
    <InnerPageWrapper
      heading="Edit Transaction"
      backLink={`/transactions/${
        routeData.data()?.transaction?.splitFromId || routeData.data()?.transaction?.id
      }`}
    >
      <Cell
        data={routeData.data}
        success={TransactionForm}
        successProps={{ onSave, loading: updateTransaction.loading }}
      />
    </InnerPageWrapper>
  )
}

export default EditTransactionPage
