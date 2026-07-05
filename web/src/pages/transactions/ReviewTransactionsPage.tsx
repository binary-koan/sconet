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

const ZoomableReceipts: Component<{
  images: { id: string; url: string; filename: string }[]
  onRotate: (image: { id: string; url: string; filename: string }) => void
  rotating: boolean
}> = (props) => {
  let outer!: HTMLDivElement
  const [transform, setTransform] = createSignal({ x: 0, y: 0, scale: 1 })
  const pointers = new Map<number, { x: number; y: number }>()
  let moved = false

  const clamped = (x: number, y: number, scale: number) => {
    const w = outer.offsetWidth
    const h = outer.offsetHeight
    return {
      x: Math.min(0, Math.max(w - w * scale, x)),
      y: Math.min(0, Math.max(h - h * scale, y)),
      scale
    }
  }

  // zoom by factor k about point p (in container coords), keeping p fixed on screen
  const zoomAt = (p: { x: number; y: number }, k: number) => {
    const t = transform()
    const scale = Math.min(8, Math.max(1, t.scale * k))
    k = scale / t.scale
    setTransform(clamped(p.x - (p.x - t.x) * k, p.y - (p.y - t.y) * k, scale))
  }

  const toLocal = (e: { clientX: number; clientY: number }) => {
    const rect = outer.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerMove = (e: PointerEvent) => {
    const prev = pointers.get(e.pointerId)
    if (!prev) return
    const p = toLocal(e)
    moved = true
    if (pointers.size === 2) {
      const [otherId, other] = [...pointers.entries()].find(([id]) => id !== e.pointerId)!
      const prevDist = Math.hypot(prev.x - other.x, prev.y - other.y)
      const dist = Math.hypot(p.x - other.x, p.y - other.y)
      const mid = { x: (p.x + other.x) / 2, y: (p.y + other.y) / 2 }
      zoomAt(mid, dist / prevDist)
      // keep midpoint under the fingers as they move together
      const prevMid = { x: (prev.x + other.x) / 2, y: (prev.y + other.y) / 2 }
      const t = transform()
      setTransform(clamped(t.x + mid.x - prevMid.x, t.y + mid.y - prevMid.y, t.scale))
      pointers.set(otherId, other)
    } else if (pointers.size === 1 && transform().scale > 1) {
      const t = transform()
      setTransform(clamped(t.x + p.x - prev.x, t.y + p.y - prev.y, t.scale))
    }
    pointers.set(e.pointerId, p)
  }

  return (
    <div class="relative h-full bg-white shadow-xs lg:rounded-sm">
      <div
        ref={outer}
        class="h-full overflow-hidden"
        // pan-y at scale 1 lets the page scroll from a touch on the image
        style={{ "touch-action": transform().scale > 1 ? "none" : "pan-y" }}
        on:pointerdown={(e) => {
          pointers.set(e.pointerId, toLocal(e))
          outer.setPointerCapture(e.pointerId)
          moved = false
        }}
        on:pointermove={onPointerMove}
        on:pointerup={(e) => pointers.delete(e.pointerId)}
        on:pointercancel={(e) => pointers.delete(e.pointerId)}
        on:wheel={(e) => {
          if (!e.ctrlKey) return
          e.preventDefault()
          zoomAt(toLocal(e), Math.exp(-e.deltaY * 0.01))
        }}
        on:dblclick={() => setTransform({ x: 0, y: 0, scale: 1 })}
      >
        <div
          class="flex h-full w-full flex-col"
          style={{
            transform: `translate(${transform().x}px, ${transform().y}px) scale(${transform().scale})`,
            "transform-origin": "0 0"
          }}
        >
          <For each={props.images}>
            {(image) => (
              <a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                class="min-h-0 flex-1"
                draggable={false}
                on:click={(e) => moved && e.preventDefault()}
              >
                <img
                  src={image.url}
                  alt={image.filename}
                  class="h-full w-full object-contain"
                  draggable={false}
                />
              </a>
            )}
          </For>
        </div>
      </div>
      {/* outside the transform so they don't zoom; order matches the stacked images */}
      <div class="absolute right-2 top-2 flex flex-col gap-2">
        <For each={props.images}>
          {(image) => (
            <Button
              size="sm"
              disabled={props.rotating}
              aria-label="Rotate image"
              onClick={() => props.onRotate(image)}
            >
              <IconRotateClockwise />
            </Button>
          )}
        </For>
      </div>
    </div>
  )
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
                      <ZoomableReceipts
                        images={transaction().receiptImages}
                        rotating={replaceReceiptImage.loading}
                        onRotate={(image) => void rotateReceiptImage(image)}
                      />
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
