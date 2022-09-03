import { gql } from "@solid-primitives/graphql"
import { Route, useNavigate } from "@solidjs/router"
import { Component } from "solid-js"
import toast from "solid-toast"
import { ACCOUNT_MAILBOXES_QUERY } from "../components/accountMailboxes/AccountMailboxesCell"
import AccountMailboxForm from "../components/accountMailboxes/AccountMailboxForm"
import FormPageWrapper from "../components/FormPageWrapper"
import {
  CreateAccountMailboxMutation,
  CreateAccountMailboxMutationVariables
} from "../graphql-types"
import { useMutation } from "../graphqlClient"

const CREATE_ACCOUNT_MAILBOX_MUTATION = gql`
  mutation CreateAccountMailbox($input: CreateAccountMailboxInput!) {
    createAccountMailbox(input: $input) {
      id
    }
  }
`

const NewAccountMailbox = () => {
  const navigate = useNavigate()

  const [createAccountMailbox, { loading }] = useMutation<
    CreateAccountMailboxMutation,
    CreateAccountMailboxMutationVariables
  >(CREATE_ACCOUNT_MAILBOX_MUTATION, {
    onSuccess: () => {
      toast.success("AccountMailbox created")
      navigate("/settings")
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [ACCOUNT_MAILBOXES_QUERY]
  })

  const onSave = (input: CreateAccountMailboxMutationVariables["input"]) => {
    createAccountMailbox({ input })
  }

  return (
    <FormPageWrapper heading="New Account" backLink="/settings">
      <AccountMailboxForm onSave={onSave} loading={loading} />
    </FormPageWrapper>
  )
}

export const NewAccountMailboxRoute: Component = () => {
  return <Route path="/account-mailboxes/new" component={NewAccountMailbox} />
}
