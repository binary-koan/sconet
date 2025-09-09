import { useNavigate, useRouteData } from "@solidjs/router"
import { Show } from "solid-js"
import toast from "solid-toast"
import { showAlert } from "../../components/AlertManager.tsx"
import InnerPageWrapper from "../../components/InnerPageWrapper.tsx"
import AccountForm from "../../components/accounts/AccountForm.tsx"
import {
  GetAccountQuery,
  GetAccountQueryVariables,
  UpdateAccountMutationVariables
} from "../../graphql-types.ts"
import { useUpdateAccount } from "../../graphql/mutations/updateAccountMutation.ts"
import { QueryResource } from "../../utils/graphqlClient/useQuery.ts"

export interface EditAccountPageData {
  data: QueryResource<GetAccountQuery, GetAccountQueryVariables>
}

const EditAccountPage = () => {
  const routeData = useRouteData<EditAccountPageData>()
  const navigate = useNavigate()

  const updateAccount = useUpdateAccount({
    onSuccess: () => {
      toast.success("Account updated")
      navigate("/settings")
    }
  })

  const onSave = async (input: UpdateAccountMutationVariables["input"], id?: string) => {
    let confirmed = true

    if (input.currencyId !== routeData.data()!.account!.currency.id) {
      confirmed = await showAlert({
        title: "Are you sure?",
        body: (
          <>
            Changing the currency code will update all associated transactions{" "}
            <strong>without</strong> currency conversion. Are you sure?
          </>
        )
      })
    }

    if (confirmed) {
      updateAccount({ id: id!, input })
    }
  }

  return (
    <InnerPageWrapper heading="Edit Account" backLink="/settings">
      <Show when={routeData.data()}>
        <AccountForm
          account={routeData.data()!.account}
          onSave={onSave}
          loading={updateAccount.loading}
        />
      </Show>
    </InnerPageWrapper>
  )
}

export default EditAccountPage
