import { useNavigate } from "@solidjs/router"
import { Component } from "solid-js"
import toast from "solid-toast"
import FormPageWrapper from "../../components/FormPageWrapper"
import TransactionForm from "../../components/transactions/TransactionForm"
import { CreateTransactionInput } from "../../graphql-types"
import { useCreateTransaction } from "../../graphql/mutations/createTransactionMutation"

const NewTransactionPage: Component = () => {
  const navigate = useNavigate()

  const [createTransaction, { loading }] = useCreateTransaction({
    onSuccess: () => {
      toast.success("Transaction created")
      navigate("/transactions")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSave = (input: CreateTransactionInput) => {
    createTransaction({ input })
  }

  return (
    <FormPageWrapper heading="New Transaction" backLink="/transactions">
      <TransactionForm onSave={onSave} loading={loading} />
    </FormPageWrapper>
  )
}

export default NewTransactionPage
