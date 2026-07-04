import { useRouteData } from "@solidjs/router"
import { IconCheck, IconChevronLeft, IconChevronRight, IconRotateClockwise } from "@tabler/icons-solidjs"
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
import { useReplaceReceiptImage } from "../../graphql/mutations/replaceReceiptImageMutation"
import { QueryResource } from "../../utils/graphqlClient/useQuery"
import { rotateImage } from "../../utils/rotateImage"

export interface ReviewTransactionsPageData {
  data: QueryResource<UnconfirmedTransactionsQuery, UnconfirmedTransactionsQueryVariables>
}

const ReviewTransactionsPage: Component = () => {
  const routeData = useRouteData<ReviewTransactionsPageData>()
  const [index, setIndex] = createSignal(0)

  const updateTransaction = useUpdateTransaction({
    refetchQueries: [UNCONFIRMED_TRANSACTIONS_QUERY, TRANSACTIONS_QUERY]
  })

  const replaceReceiptImage = useReplaceReceiptImage({
    refetchQueries: [UNCONFIRMED_TRANSACTIONS_QUERY]
  })

  const rotateReceiptImage = async (image: { id: string; url: string; filename: string }) =>
    replaceReceiptImage({ id: image.id, image: await rotateImage(image.url, image.filename) })

  return (
    <>
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
                <>
                  <PageHeader size="sm">{index() + 1} of {props.data.transactions.nodes.length}</PageHeader>
                  {/* Hardcoded viewport offset; MainLayout's min-h-screen grows with content so flex-1 can't cap this */}
                  <div class="grid h-[calc(100dvh-12rem)] grid-cols-1 grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-1">
                    <Show
                      when={transaction().receiptImages.length > 0}
                      fallback={<div class="italic text-gray-600">No receipt</div>}
                    >
                      <div class="overflow-y-auto bg-white shadow-xs lg:rounded-sm">
                        <For each={transaction().receiptImages}>
                          {(image) => (
                            <div class="relative">
                              <a href={image.url} target="_blank" rel="noopener noreferrer">
                                <img src={image.url} alt={image.filename} class="w-full" />
                              </a>
                              <Button
                                class="absolute right-2 top-2"
                                size="sm"
                                disabled={replaceReceiptImage.loading}
                                aria-label="Rotate image"
                                onClick={() => void rotateReceiptImage(image)}
                              >
                                <IconRotateClockwise />
                              </Button>
                            </div>
                          )}
                        </For>
                      </div>
                    </Show>
                    <div class="overflow-y-auto bg-white p-4 shadow-xs lg:rounded-sm">
                      <TransactionView data={{ transaction: transaction() }} showReceiptImages={false} />
                    </div>
                  </div>

                  <div class="mt-4 px-2 flex items-center justify-center gap-2">
                    <Button
                      disabled={index() <= 0}
                      onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                      aria-label="Previous"
                    >
                      <IconChevronLeft />
                    </Button>
                    <Button
                      class="flex-1"
                      colorScheme="primary"
                      disabled={updateTransaction.loading}
                      onClick={() =>
                        updateTransaction({ id: transaction().id, input: { confirmed: true } })
                      }
                    >
                      Confirm
                    </Button>
                    <Button
                      disabled={index() >= transactions().length - 1}
                      onClick={() => setIndex((i) => Math.min(i + 1, transactions().length - 1))}
                      aria-label="Next"
                    >
                      <IconChevronRight />
                    </Button>
                  </div>
                </>
              )}
            </Show>
          )
        }}
      />
    </>
  )
}

export default ReviewTransactionsPage
