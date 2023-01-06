import { sum } from "lodash"
import { Component, createSignal, Index } from "solid-js"
import { FullTransactionFragment } from "../../graphql-types"
import { useSplitTransaction } from "../../graphql/mutations/splitTransactionMutation"
import { Button } from "../base/Button"
import { Input } from "../base/Input"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal"

export const SplitTransactionModal: Component<{
  transaction: FullTransactionFragment
  isOpen: boolean
  onClose: () => void
  onFinish: () => void
}> = (props) => {
  const splitTransaction = useSplitTransaction()
  const [amounts, setAmounts] = createSignal([""])

  const numericAmounts = () =>
    amounts().map((amount) => {
      const parsed = parseInt(amount)

      return isNaN(parsed) ? 0 : parsed
    })

  const remainder = () => Math.abs(props.transaction.amount.decimalAmount) - sum(numericAmounts())

  const doUpdate = async () => {
    await splitTransaction({
      id: props.transaction.id,
      amounts: numericAmounts()
        .filter((amount) => amount > 0)
        .concat(remainder())
        .map((amount) => (props.transaction.amount.decimalAmount < 0 ? -amount : amount))
    })
    props.onFinish()
  }

  const setAmount = (updateIndex: number, newAmount: string) => {
    setAmounts((amounts) => {
      const newAmounts = amounts.map((amount, index) =>
        index === updateIndex ? newAmount : amount
      )

      if (newAmounts[newAmounts.length - 1]) {
        newAmounts.push("")
      }

      return newAmounts
    })
  }

  return (
    <Modal onClickOutside={props.onClose} isOpen={props.isOpen}>
      <ModalContent>
        <ModalTitle>
          Split Transaction <ModalCloseButton onClick={props.onClose} />
        </ModalTitle>
        <div class="flex flex-col gap-2">
          <Index each={amounts()}>
            {(amount, index) => (
              <Input
                value={amount()}
                placeholder="Enter amount"
                onInput={(e) => setAmount(index, e.currentTarget.value)}
              />
            )}
          </Index>
          <div class="mb-6">Remainder: {remainder}</div>
        </div>

        <Button colorScheme="primary" onClick={doUpdate}>
          Split
        </Button>
      </ModalContent>
    </Modal>
  )
}
