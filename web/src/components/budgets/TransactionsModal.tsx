import { Show } from "solid-js"
import { useTransactionsQuery } from "../../graphql/queries/transactionsQuery"
import { Modal, ModalContent, ModalTitle } from "../base/Modal"
import LoadingBar from "../LoadingBar"
import { For } from "solid-js"
import { TransactionFilterInput } from "../../graphql-types"

export const TransactionsModal = (props: {
  categoryId: string | null
  filter: Partial<TransactionFilterInput>
  onClose: () => void
}) => {
  const query = useTransactionsQuery(() => ({
    limit: 1000,
    filter: {
      ...props.filter,
      categoryIds: [props.categoryId]
    }
  }))

  const transactionsToShow = () =>
    query()
      ?.transactions.nodes.flatMap((transaction) => {
        if (transaction.splitTo) {
          return transaction.splitTo
            .filter((split) => split.category?.id === props.categoryId)
            .map((split) => ({ ...split, shop: transaction.shop }))
        } else {
          return [transaction]
        }
      })
      .sort((a, b) => (a.amount?.amountDecimal || 0) - (b.amount?.amountDecimal || 0))

  return (
    <Modal isOpen={true} onClickOutside={props.onClose}>
      <ModalContent class="!my-0 flex max-h-[90vh] flex-col">
        <ModalTitle>Transactions</ModalTitle>
        <Show when={transactionsToShow()} fallback={<LoadingBar />}>
          {(transactionsToShow) => (
            <ul class="min-h-0 flex-1 overflow-auto">
              <For each={transactionsToShow()}>
                {(transaction) => (
                  <li class="flex justify-between py-1">
                    <span>
                      {transaction.shop}{" "}
                      <span class="text-gray-600">&ndash; {transaction.memo}</span>
                    </span>
                    <span>{transaction.amount?.formatted}</span>
                  </li>
                )}
              </For>
            </ul>
          )}
        </Show>
      </ModalContent>
    </Modal>
  )
}
