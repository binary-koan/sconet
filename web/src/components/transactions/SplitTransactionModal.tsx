import { last } from "lodash"
import { evaluate, sum } from "mathjs"
import { IconMinus } from "@tabler/icons-solidjs"
import { Component, For, Show } from "solid-js"
import { createStore } from "solid-js/store"
import toast from "solid-toast"
import { ListingTransactionFragment } from "../../graphql-types"
import { useSplitTransaction } from "../../graphql/mutations/splitTransactionMutation"
import { useGetCurrencyQuery } from "../../graphql/queries/getCurrencyQuery"
import { namedIcons } from "../../utils/namedIcons"
import CategoryIndicator from "../CategoryIndicator"
import { Button } from "../base/Button"
import { Input } from "../base/Input"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal"
import { CategorySelect } from "../categories/CategorySelect"

type SplitCategory = { id: string; name: string; icon: string; color: string }

type SplitValues = Array<{
  category: SplitCategory | null
  splits: Array<{ amount: string; memo: string; numericAmount: number }>
}>

export const SplitTransactionModal: Component<{
  transaction: ListingTransactionFragment
  isOpen: boolean
  onClose: () => void
  onFinish: () => void
}> = (props) => {
  const splitTransaction = useSplitTransaction({
    onSuccess: () => {
      toast.success("Transaction split")
      props.onFinish()
    }
  })
  const currencyData = useGetCurrencyQuery(() => ({
    id: (props.transaction.shopCurrency?.id || props.transaction.currency?.id)!
  }))

  const [splits, setSplits] = createStore<SplitValues>(
    // eslint-disable-next-line solid/reactivity
    getCurrentSplits(props.transaction)
  )

  const parseNumericAmount = (amount: string) => {
    try {
      const evaluated = evaluate(amount)
      return typeof evaluated === "number" ? evaluated : 0
    } catch (e) {
      return 0
    }
  }

  const shopAmount = () =>
    props.transaction.shopAmount?.amountDecimal || props.transaction.amount?.amountDecimal || 0

  const remainder = () =>
    parseFloat(
      (
        Math.abs(shopAmount()) -
        sum(splits.flatMap(({ splits }) => splits.map((split) => split.numericAmount)))
      ).toFixed(currencyData()?.currency?.decimalDigits || 0)
    )

  const doUpdate = async () => {
    let splitsToSend = splits
      .flatMap(({ splits, category }) =>
        splits.map((split) => ({ ...split, categoryId: category?.id || null }))
      )
      .filter((split) => split.amount && split.memo)

    if (remainder() > 0) {
      splitsToSend.push({
        amount: "",
        memo: "",
        numericAmount: remainder(),
        categoryId: props.transaction.category?.id || null
      })
    }

    if (shopAmount() < 0) {
      splitsToSend = splitsToSend.map((split) => ({
        ...split,
        numericAmount: -split.numericAmount
      }))
    }

    await splitTransaction({
      id: props.transaction.id,
      splits: splitsToSend.map(({ memo, categoryId, numericAmount }) => ({
        memo,
        categoryId,
        amountCents: Math.round(
          numericAmount * 10 ** (currencyData()?.currency?.decimalDigits || 0)
        )
      }))
    })
  }

  const setField = (
    updateCategoryId: string | null,
    updateIndex: number,
    field: "amount" | "memo",
    newValue: string
  ) => {
    setSplits(
      (split) => (split.category?.id || null) === updateCategoryId,
      "splits",
      updateIndex,
      (split) => ({
        ...split,
        [field]: newValue,
        numericAmount: parseNumericAmount(field === "amount" ? newValue : split.amount)
      })
    )

    if (
      last(splits.find((split) => (split.category?.id || null) === updateCategoryId)?.splits)
        ?.amount
    ) {
      setSplits(
        (split) => (split.category?.id || null) === updateCategoryId,
        "splits",
        (splits) => [...splits, { amount: "", memo: "", numericAmount: 0 }]
      )
    }
  }

  const setCategory = (oldCategoryId: string | null, newCategory: SplitCategory) => {
    setSplits((split) => (split.category?.id || null) === oldCategoryId, "category", {
      ...newCategory
    })
  }

  const addCategory = () => {
    setSplits([
      ...splits,
      {
        category: null,
        splits: [{ amount: "", memo: "", numericAmount: 0 }]
      }
    ])
  }

  const removeCategory = (category: SplitCategory | null) => {
    setSplits((splits) => splits.filter((split) => split.category?.id !== category?.id))
  }

  const canSplitCategories = () => shopAmount() < 0 && props.transaction.includeInReports

  return (
    <Modal onClickOutside={props.onClose} isOpen={props.isOpen}>
      <ModalContent>
        <ModalTitle>
          Split Transaction <ModalCloseButton onClick={props.onClose} />
        </ModalTitle>
        <div class="flex flex-col gap-2">
          <For each={splits}>
            {(categorySplit) => (
              <div class="mb-6 flex flex-col gap-2">
                <Show when={canSplitCategories()}>
                  <div class="flex items-center">
                    <CategorySelect
                      value={categorySplit.category?.id}
                      onChange={(newCategory) =>
                        setCategory(categorySplit.category?.id || null, newCategory)
                      }
                      filter={(selectable) =>
                        !splits.some(({ category }) => category?.id === selectable.id)
                      }
                    >
                      {(selectedCategory) => (
                        <div class="mb-1 flex items-center gap-2 font-semibold">
                          <CategoryIndicator
                            class="h-6 w-6"
                            icon={
                              selectedCategory?.icon
                                ? namedIcons[selectedCategory?.icon]
                                : undefined
                            }
                            color={selectedCategory?.color}
                          />
                          {selectedCategory?.name || "Uncategorized"}
                        </div>
                      )}
                    </CategorySelect>
                    <Button
                      variant="ghost"
                      class="-mr-2 ml-auto"
                      aria-label="Remove category"
                      onClick={() => removeCategory(categorySplit.category)}
                    >
                      <IconMinus />
                    </Button>
                  </div>
                </Show>
                <For each={categorySplit.splits}>
                  {(split, index) => (
                    <div class="grid grid-cols-5 gap-2">
                      <Input
                        class="col-span-3"
                        value={split.memo}
                        placeholder="Memo"
                        onInput={(e) =>
                          setField(
                            categorySplit.category?.id || null,
                            index(),
                            "memo",
                            e.currentTarget.value
                          )
                        }
                      />
                      <Input
                        class="col-span-2"
                        value={split.amount}
                        placeholder="Amount"
                        onInput={(e) =>
                          setField(
                            categorySplit.category?.id || null,
                            index(),
                            "amount",
                            e.currentTarget.value
                          )
                        }
                      />
                    </div>
                  )}
                </For>
              </div>
            )}
          </For>
          <Show when={canSplitCategories()}>
            <Button
              class="mb-6"
              onClick={addCategory}
              disabled={splits.some((split) => !split.category)}
            >
              Add category
            </Button>
          </Show>
          <div class="mb-6">Remainder: {remainder()}</div>
        </div>

        <Button colorScheme="primary" onClick={doUpdate}>
          Split
        </Button>
      </ModalContent>
    </Modal>
  )
}

function getCurrentSplits(transaction: ListingTransactionFragment): SplitValues {
  const transactions = transaction.splitTo

  if (!transactions.length) {
    return [
      {
        category: transaction.category ? { ...transaction.category } : null,
        splits: [
          {
            amount: "",
            memo: "",
            numericAmount: 0
          }
        ]
      }
    ]
  }

  const mapping: SplitValues = []

  transactions.forEach((transaction) => {
    const categoryId = transaction.category?.id || null
    const existing = mapping.find(({ category }) => (category?.id || null) === categoryId)

    const value = {
      amount: Math.abs(
        transaction.shopAmount?.amountDecimal || transaction.amount?.amountDecimal || 0
      ).toString(),
      memo: transaction.memo,
      numericAmount: Math.abs(
        transaction.shopAmount?.amountDecimal || transaction.amount?.amountDecimal || 0
      )
    }

    if (existing) {
      existing.splits.push(value)
    } else {
      mapping.push({
        category: transaction.category ? { ...transaction.category } : null,
        splits: [value]
      })
    }
  })

  return mapping
}
