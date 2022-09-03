import { gql } from "@solid-primitives/graphql"
import { Route, useNavigate } from "@solidjs/router"
import { Component } from "solid-js"
import { toast } from "solid-toast"
import FormPageWrapper from "../components/FormPageWrapper"
import TransactionForm from "../components/transactions/TransactionForm"
import { CreateTransactionMutation, CreateTransactionMutationVariables } from "../graphql-types"
import { useMutation } from "../graphqlClient"

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
    }
  }
`

const NewTransaction: Component = () => {
  const navigate = useNavigate()

  const [createTransaction, { loading }] = useMutation<
    CreateTransactionMutation,
    CreateTransactionMutationVariables
  >(CREATE_TRANSACTION_MUTATION, {
    onSuccess: () => {
      toast.success("Transaction created")
      navigate("/transactions")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSave = (input: CreateTransactionMutationVariables["input"]) => {
    createTransaction({ input })
  }

  return (
    <FormPageWrapper heading="New Transaction" backLink="/transactions">
      <TransactionForm onSave={onSave} loading={loading} />
    </FormPageWrapper>
  )
}

export const NewTransactionRoute: Component = () => {
  return <Route path="/transactions/new" component={NewTransaction} />
}
