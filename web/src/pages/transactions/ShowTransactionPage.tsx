import { useRouteData } from "@solidjs/router"
import { TbArrowsSplit, TbEye, TbEyeOff } from "solid-icons/tb"
import { Component, Show, createSignal } from "solid-js"
import { Cell } from "../../components/Cell"
import InnerPageWrapper from "../../components/InnerPageWrapper"
import { Button } from "../../components/base/Button"
import { SplitTransactionModal } from "../../components/transactions/SplitTransactionModal"
import { TransactionView } from "../../components/transactions/TransactionView"
import { GetTransactionQuery, GetTransactionQueryVariables } from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { QueryResource } from "../../utils/graphqlClient/useQuery"

export interface ShowTransactionPageData {
  data: QueryResource<GetTransactionQuery, GetTransactionQueryVariables>
}

const ShowTransactionPage: Component = () => {
  const routeData = useRouteData<ShowTransactionPageData>()
  const [splitModalVisible, setSplitModalVisible] = createSignal(false)

  const updateTransaction = useUpdateTransaction()

  return (
    <InnerPageWrapper
      heading="Transaction"
      backLink="/transactions"
      actions={
        <div class="flex gap-2">
          <Button
            onClick={() =>
              updateTransaction({
                id: routeData.data()!.transaction!.id,
                input: { includeInReports: !routeData.data()!.transaction!.includeInReports }
              })
            }
          >
            {routeData.data()?.transaction?.includeInReports ? <TbEye /> : <TbEyeOff />}
          </Button>

          <Button onClick={() => setSplitModalVisible(true)}>
            <TbArrowsSplit class="mr-2" />
            Split
          </Button>
        </div>
      }
    >
      <Show when={splitModalVisible() && routeData.data()?.transaction}>
        <SplitTransactionModal
          isOpen={true}
          onClose={() => setSplitModalVisible(false)}
          onFinish={() => {
            setSplitModalVisible(false)
          }}
          transaction={routeData.data()!.transaction!}
        />
      </Show>

      <Cell data={routeData.data} success={TransactionView} />
    </InnerPageWrapper>
  )
}

export default ShowTransactionPage
