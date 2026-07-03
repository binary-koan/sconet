import { useRouteData } from "@solidjs/router"
import { IconArrowsSplit, IconCheck, IconEye, IconEyeOff, IconStar } from "@tabler/icons-solidjs"
import { Component, Show, createSignal } from "solid-js"
import { Cell } from "../../components/Cell"
import InnerPageWrapper from "../../components/InnerPageWrapper"
import { Button } from "../../components/base/Button"
import { SplitTransactionModal } from "../../components/transactions/SplitTransactionModal"
import { FavouriteTransactionModal } from "../../components/transactions/FavouriteTransactionModal"
import { TransactionView } from "../../components/transactions/TransactionView"
import { GetTransactionQuery, GetTransactionQueryVariables } from "../../graphql-types"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { GET_TRANSACTION_QUERY } from "../../graphql/queries/getTransactionQuery"
import { TRANSACTIONS_QUERY } from "../../graphql/queries/transactionsQuery"
import { UNCONFIRMED_TRANSACTIONS_QUERY } from "../../graphql/queries/unconfirmedTransactionsQuery"
import { QueryResource } from "../../utils/graphqlClient/useQuery"

export interface ShowTransactionPageData {
  data: QueryResource<GetTransactionQuery, GetTransactionQueryVariables>
}

const ShowTransactionPage: Component = () => {
  const routeData = useRouteData<ShowTransactionPageData>()
  const [splitModalVisible, setSplitModalVisible] = createSignal(false)
  const [favouriteModalVisible, setFavouriteModalVisible] = createSignal(false)

  const updateTransaction = useUpdateTransaction({
    refetchQueries: [TRANSACTIONS_QUERY, GET_TRANSACTION_QUERY, UNCONFIRMED_TRANSACTIONS_QUERY]
  })

  return (
    <InnerPageWrapper
      heading="Transaction"
      backLink="/transactions"
      actions={
        <div class="flex gap-2">
          <Show when={routeData.data()?.transaction && !routeData.data()!.transaction!.confirmed}>
            <Button
              colorScheme="primary"
              onClick={() =>
                updateTransaction({
                  id: routeData.data()!.transaction!.id,
                  input: { confirmed: true }
                })
              }
            >
              <IconCheck class="mr-2" />
              Confirm
            </Button>
          </Show>
          <Button onClick={() => setFavouriteModalVisible(true)} aria-label="Save as favourite">
            <IconStar />
          </Button>
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
      <Show when={favouriteModalVisible() && routeData.data()?.transaction}>
        <FavouriteTransactionModal
          isOpen={true}
          onClose={() => setFavouriteModalVisible(false)}
          transaction={routeData.data()!.transaction!}
        />
      </Show>

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
