import { evaluate, sum } from "mathjs"
import { Component, For, createSignal } from "solid-js"
import { FullTransactionFragment } from "../../graphql-types"
import { useSplitTransaction } from "../../graphql/mutations/splitTransactionMutation"
import { useGetCurrencyQuery } from "../../graphql/queries/getCurrencyQuery"
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
  const currencyData = useGetCurrencyQuery(() => ({ id: props.transaction.currencyId }))

  const [splits, setSplits] = createSignal(
    props.transaction.splitTo
      .map((child) => ({
        amount: Math.abs(child.amount.decimalAmount).toString(),
        memo: child.memo,
        numericAmount: Math.abs(child.amount.decimalAmount)
      }))
      .concat({ amount: "", memo: "", numericAmount: 0 })
  )

  const parseNumericAmount = (amount: string) => {
    try {
      const evaluated = evaluate(amount)
      return typeof evaluated === "number" ? evaluated : 0
    } catch (e) {
      return 0
    }
  }

  const remainder = () =>
    parseFloat(
      (
        Math.abs(props.transaction.amount.decimalAmount) -
        sum(splits().map((split) => split.numericAmount))
      ).toFixed(currencyData()?.currency?.decimalDigits || 0)
    )

  const doUpdate = async () => {
    let splitsToSend = splits().filter((split) => split.amount && split.memo)

    if (remainder() > 0) {
      splitsToSend.push({ amount: "", memo: "", numericAmount: remainder() })
    }

    if (props.transaction.amount.decimalAmount < 0) {
      splitsToSend = splitsToSend.map((split) => ({
        ...split,
        numericAmount: -split.numericAmount
      }))
    }

    await splitTransaction({
      id: props.transaction.id,
      splits: splitsToSend.map(({ memo, numericAmount }) => ({
        memo,
        amount: Math.round(numericAmount * 10 ** (currencyData()?.currency?.decimalDigits || 0))
      }))
    })

    props.onFinish()
  }

  const setField = (updateIndex: number, field: "amount" | "memo", newValue: string) => {
    setSplits((splits) => {
      const newSplits = splits.map((split, index) => {
        if (index === updateIndex) {
          split[field] = newValue
          split.numericAmount = parseNumericAmount(splits[updateIndex].amount)
        }
        return split
      })

      if (newSplits[newSplits.length - 1]?.amount) {
        newSplits.push({ amount: "", memo: "", numericAmount: 0 })
      }

      return newSplits
    })
  }

  return (
    <Modal onClickOutside={props.onClose} isOpen={props.isOpen}>
      <ModalContent>
        <ModalTitle>
          Split Transaction <ModalCloseButton onClick={props.onClose} />
        </ModalTitle>
        <div class="flex flex-col gap-2">
          <For each={splits()}>
            {({ amount, memo }, index) => (
              <div class="grid grid-cols-5 gap-2">
                <Input
                  class="col-span-3"
                  value={memo}
                  placeholder="Memo"
                  onInput={(e) => setField(index(), "memo", e.currentTarget.value)}
                />
                <Input
                  class="col-span-2"
                  value={amount}
                  placeholder="Amount"
                  onInput={(e) => setField(index(), "amount", e.currentTarget.value)}
                />
              </div>
            )}
          </For>
          <div class="mb-6">Remainder: {remainder()}</div>
        </div>

        <Button colorScheme="primary" onClick={doUpdate}>
          Split
        </Button>
      </ModalContent>
    </Modal>
  )
}
