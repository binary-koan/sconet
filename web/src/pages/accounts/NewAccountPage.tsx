import { useNavigate } from "@solidjs/router"
import toast from "solid-toast"
import InnerPageWrapper from "../../components/InnerPageWrapper"
import AccountForm from "../../components/accounts/AccountForm"
import { CreateAccountMutationVariables } from "../../graphql-types"
import { useCreateAccount } from "../../graphql/mutations/createAccountMutation"

const NewAccountPage = () => {
  const navigate = useNavigate()

  const createAccount = useCreateAccount({
    onSuccess: () => {
      toast.success("Account created")
      navigate("/settings")
    },
    onError: (error) => toast.error(error.message)
  })

  const onSave = (input: CreateAccountMutationVariables["input"]) => {
    createAccount({ input })
  }

  return (
    <InnerPageWrapper heading="New Account" backLink="/settings">
      <AccountForm onSave={onSave} loading={createAccount.loading} />
    </InnerPageWrapper>
  )
}

export default NewAccountPage
