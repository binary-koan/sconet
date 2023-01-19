import { useNavigate, useRouteData } from "@solidjs/router"
import { Component } from "solid-js"
import toast from "solid-toast"
import { Cell } from "../../components/Cell"
import FormPageWrapper from "../../components/FormPageWrapper"
import TransactionForm from "../../components/transactions/TransactionForm"
import {
  CreateTransactionInput,
  GetTransactionQuery,
  GetTransactionQueryVariables
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

  const onSave = (input: CreateTransactionInput) => {
    updateTransaction({ id: routeData.data()!.transaction!.id, input })
  }

  return (
    <FormPageWrapper heading="Edit Transaction" backLink="/transactions">
      <Cell
        data={routeData.data}
        success={TransactionForm}
        successProps={{ onSave, loading: updateTransaction.loading }}
      />
    </FormPageWrapper>
  )
}

export default EditTransactionPage
