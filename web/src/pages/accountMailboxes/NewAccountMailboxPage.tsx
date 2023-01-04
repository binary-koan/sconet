import { useNavigate } from "@solidjs/router"
import toast from "solid-toast"
import AccountMailboxForm from "../../components/accountMailboxes/AccountMailboxForm"
import FormPageWrapper from "../../components/FormPageWrapper"
import { CreateAccountMailboxMutationVariables } from "../../graphql-types"
import { useCreateAccountMailbox } from "../../graphql/mutations/createAccountMailboxMutation"

const NewAccountMailboxPage = () => {
  const navigate = useNavigate()

  const createAccountMailbox = useCreateAccountMailbox({
    onSuccess: () => {
      toast.success("AccountMailbox created")
      navigate("/settings")
    },
    onError: (error) => toast.error(error.message)
  })

  const onSave = (input: CreateAccountMailboxMutationVariables["input"]) => {
    createAccountMailbox({ input })
  }

  return (
    <FormPageWrapper heading="New Account" backLink="/settings">
      <AccountMailboxForm onSave={onSave} loading={createAccountMailbox.loading} />
    </FormPageWrapper>
  )
}

export default NewAccountMailboxPage
