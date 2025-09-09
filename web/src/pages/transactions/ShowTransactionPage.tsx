import { useRouteData } from "@solidjs/router"
import { IconArrowsSplit, IconEye, IconEyeOff } from "@tabler/icons-solidjs"
import { Component, Show, createSignal } from "solid-js"
import { Cell } from "../../components/Cell.tsx"
import InnerPageWrapper from "../../components/InnerPageWrapper.tsx"
import { Button } from "../../components/base/Button.tsx"
import { SplitTransactionModal } from "../../components/transactions/SplitTransactionModal.tsx"
import { TransactionView } from "../../components/transactions/TransactionView.tsx"
import { GetTransactionQuery, GetTransactionQueryVariables } from "../../graphql-types.ts"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation.ts"
import { QueryResource } from "../../utils/graphqlClient/useQuery.ts"

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
            aria-label={
              routeData.data()?.transaction?.includeInReports
                ? "Hide from reports"
                : "Show in reports"
            }
          >
            {routeData.data()?.transaction?.includeInReports ? <IconEye /> : <IconEyeOff />}
          </Button>

          <Button onClick={() => setSplitModalVisible(true)}>
            <IconArrowsSplit class="mr-2" />
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
