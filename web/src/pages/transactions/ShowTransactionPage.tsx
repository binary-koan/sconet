import { useRouteData } from "@solidjs/router"
import { Component, createSignal, Show } from "solid-js"
import { Button, LinkButton } from "../../components/base/Button"
import { Cell } from "../../components/Cell"
import InnerPageWrapper from "../../components/InnerPageWrapper"
import { SplitTransactionModal } from "../../components/transactions/SplitTransactionModal"
import { TransactionView } from "../../components/transactions/TransactionView"
import { GetTransactionQuery, GetTransactionQueryVariables } from "../../graphql-types"
import { QueryResource } from "../../utils/graphqlClient/useQuery"

export interface ShowTransactionPageData {
  data: QueryResource<GetTransactionQuery, GetTransactionQueryVariables>
}

const ShowTransactionPage: Component = () => {
  const routeData = useRouteData<ShowTransactionPageData>()
  const [splitModalVisible, setSplitModalVisible] = createSignal(false)

  return (
    <InnerPageWrapper
      heading="Transaction"
      backLink="/transactions"
      actions={
        <div class="flex gap-2">
          <Button onClick={() => setSplitModalVisible(true)}>Split transaction</Button>
          <LinkButton
            colorScheme="primary"
            href={`/transactions/${routeData.data()?.transaction?.id}/edit`}
          >
            Edit
          </LinkButton>
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
