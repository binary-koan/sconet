import { useNavigate } from "@solidjs/router"
import toast from "solid-toast"
import InnerPageWrapper from "../../components/InnerPageWrapper.tsx"
import AccountForm from "../../components/accounts/AccountForm.tsx"
import { CreateAccountMutationVariables } from "../../graphql-types.ts"
import { useCreateAccount } from "../../graphql/mutations/createAccountMutation.ts"

const NewAccountPage = () => {
  const navigate = useNavigate()

  const createAccount = useCreateAccount({
    onSuccess: () => {
      toast.success("Account created")
      navigate("/settings")
    }
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
