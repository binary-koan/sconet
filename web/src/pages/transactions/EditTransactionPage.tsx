import { useNavigate, useRouteData } from "@solidjs/router"
import { Component, Resource } from "solid-js"
import toast from "solid-toast"
import { Cell } from "../../components/Cell"
import FormPageWrapper from "../../components/FormPageWrapper"
import TransactionForm from "../../components/transactions/TransactionForm"
import { CreateTransactionInput, GetTransactionQuery } from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"

export interface EditTransactionPageData {
  data: Resource<GetTransactionQuery>
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
