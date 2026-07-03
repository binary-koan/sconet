import { useRouteData } from "@solidjs/router"
import { IconCheck, IconChevronLeft, IconChevronRight } from "@tabler/icons-solidjs"
import { Component, For, Show, createSignal } from "solid-js"
import { Cell } from "../../components/Cell"
import { Button } from "../../components/base/Button"
import { PageHeader } from "../../components/base/PageHeader"
import { TransactionView } from "../../components/transactions/TransactionView"
import {
  UnconfirmedTransactionsQuery,
  UnconfirmedTransactionsQueryVariables
} from "../../graphql-types"
import { UNCONFIRMED_TRANSACTIONS_QUERY } from "../../graphql/queries/unconfirmedTransactionsQuery"
import { useUpdateTransaction } from "../../graphql/mutations/updateTransactionMutation"
import { TRANSACTIONS_QUERY } from "../../graphql/queries/transactionsQuery"
import { QueryResource } from "../../utils/graphqlClient/useQuery"

export interface ReviewTransactionsPageData {
  data: QueryResource<UnconfirmedTransactionsQuery, UnconfirmedTransactionsQueryVariables>
}

const ReviewTransactionsPage: Component = () => {
  const routeData = useRouteData<ReviewTransactionsPageData>()
  const [index, setIndex] = createSignal(0)

  const updateTransaction = useUpdateTransaction({
    refetchQueries: [UNCONFIRMED_TRANSACTIONS_QUERY, TRANSACTIONS_QUERY]
  })

  return (
    <>
      <PageHeader size="lg">Review</PageHeader>
      <Cell
        data={routeData.data}
        success={(props: { data: UnconfirmedTransactionsQuery }) => {
          const transactions = () => props.data.transactions.nodes
          // ponytail: clamp instead of tracking ids — refetch after confirm shrinks the list
          const current = () => transactions()[Math.min(index(), transactions().length - 1)]

          return (
            <Show
              when={current()}
              fallback={
                <div class="flex min-h-[50vh] flex-col items-center justify-center text-gray-600">
                  <IconCheck size="3em" class="mb-4" />
                  Nothing to review.
                </div>
              }
            >
              {(transaction) => (
                <div class="flex flex-col">
                  <div class="flex flex-col gap-4 md:h-[calc(100vh-14rem)] md:flex-row">
                    <div class="bg-white p-4 shadow-xs md:flex-1 md:overflow-y-auto lg:rounded-sm">
                      <TransactionView data={{ transaction: transaction() }} />
                    </div>
                    <div class="max-h-[50vh] overflow-y-auto bg-white p-4 shadow-xs md:max-h-none md:flex-1 lg:rounded-sm">
                      <Show
                        when={transaction().receiptImages.length > 0}
                        fallback={<div class="italic text-gray-600">No receipt</div>}
                      >
                        <For each={transaction().receiptImages}>
                          {(image) => (
                            <a href={image.url} target="_blank" rel="noopener noreferrer">
                              <img src={image.url} alt={image.filename} class="mb-2 w-full" />
                            </a>
                          )}
                        </For>
                      </Show>
                    </div>
                  </div>

                  <div class="mt-4 flex items-center justify-center gap-2">
                    <Button
                      disabled={index() <= 0}
                      onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                      aria-label="Previous"
                    >
                      <IconChevronLeft />
                    </Button>
                    <Button
                      colorScheme="primary"
                      disabled={updateTransaction.loading}
                      onClick={() =>
                        updateTransaction({ id: transaction().id, input: { confirmed: true } })
                      }
                    >
                      <IconCheck class="mr-2" />
                      Confirm ({index() + 1} of {transactions().length})
                    </Button>
                    <Button
                      disabled={index() >= transactions().length - 1}
                      onClick={() => setIndex((i) => Math.min(i + 1, transactions().length - 1))}
                      aria-label="Next"
                    >
                      <IconChevronRight />
                    </Button>
                  </div>
                </div>
              )}
            </Show>
          )
        }}
      />
    </>
  )
}

export default ReviewTransactionsPage
