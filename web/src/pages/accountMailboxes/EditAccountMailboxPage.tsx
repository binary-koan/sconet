import { useNavigate, useRouteData } from "@solidjs/router"
import { Show } from "solid-js"
import toast from "solid-toast"
import AccountMailboxForm from "../../components/accountMailboxes/AccountMailboxForm"
import InnerPageWrapper from "../../components/InnerPageWrapper"
import {
  GetAccountMailboxQuery,
  GetAccountMailboxQueryVariables,
  UpdateAccountMailboxMutationVariables
} from "../../graphql-types"
import { useUpdateAccountMailbox } from "../../graphql/mutations/updateAccountMailboxMutation"
import { QueryResource } from "../../utils/graphqlClient/useQuery"

export interface EditAccountMailboxPageData {
  data: QueryResource<GetAccountMailboxQuery, GetAccountMailboxQueryVariables>
}

const EditAccountMailboxPage = () => {
  const routeData = useRouteData<EditAccountMailboxPageData>()
  const navigate = useNavigate()

  const updateAccountMailbox = useUpdateAccountMailbox({
    onSuccess: () => {
      toast.success("AccountMailbox updated")
      navigate("/settings")
    },
    onError: (error) => toast.error(error.message)
  })

  const onSave = (input: UpdateAccountMailboxMutationVariables["input"], id?: string) => {
    updateAccountMailbox({ id: id!, input })
  }

  return (
    <InnerPageWrapper heading="Edit Account" backLink="/settings">
      <Show when={routeData.data()}>
        <AccountMailboxForm
          accountMailbox={routeData.data()!.accountMailbox}
          onSave={onSave}
          loading={updateAccountMailbox.loading}
        />
      </Show>
    </InnerPageWrapper>
  )
}

export default EditAccountMailboxPage
