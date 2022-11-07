import { TbPlus } from "solid-icons/tb"
import { Component, createSignal } from "solid-js"
import { Button } from "../base/Button"
import { Input } from "../base/Input"
import AmountInput from "./AmountInput"
import RelationEditInput from "./RelationEditInput"

const NewTransactionItem: Component<{ date: Date }> = (props) => {
  const [isIncome, setIncome] = createSignal(false)
  const [category, setCategory] = createSignal(undefined)
  const [accountMailbox, setAccountMailbox] = createSignal(undefined)
  const [memo, setMemo] = createSignal("")
  const [amount, setAmount] = createSignal("")

  // const [createTransaction] = useMutation(CREATE_TRANSACTION_MUTATION, {
  //   variables: {
  //     input: {
  //       memo,
  //       amount: isIncome ? parseInt(amount) : -parseInt(amount),
  //       categoryId: category?.id,
  //       accountMailboxId: accountMailbox?.id,
  //       date: date.toISOString(),
  //     },
  //   },
  //   onCompleted: () => {
  //     toast({ status: 'success', title: 'Transaction created' })
  //     setCategory(undefined)
  //     setAccountMailbox(undefined)
  //     setMemo('')
  //     setAmount('')
  //   },
  //   onError: (error) => {
  //     toast({ status: 'error', title: error.message })
  //   },
  //   refetchQueries: [QUERY],
  // })

  return (
    <div class="flex items-center bg-white px-4 py-2 shadow-sm">
      <RelationEditInput
        category={category}
        accountMailbox={accountMailbox}
        isIncome={false}
        hasParent={false}
        includeInReports={true}
        isEditing={true}
        hasChildren={false}
        onChangeCategory={setCategory}
        onChangeAccountMailbox={setAccountMailbox}
      />

      <Input
        size="custom"
        class="ml-2 h-10 min-w-0 flex-[3] px-2"
        value={memo()}
        onChange={(e) => setMemo(e.currentTarget.value)}
      />

      <AmountInput
        containerProps={{
          class: "ml-2 flex-[2] min-w-0"
        }}
        onLeftAddonClick={() => setIncome((isIncome) => !isIncome)}
        prefix={isIncome() ? "+" : "-"}
        value={amount()}
        onChange={(e) => setAmount(e.currentTarget.value)}
      />

      <Button
        size="square"
        class="ml-2"
        colorScheme="primary"
        aria-label="Confirm"
        onClick={() => {}}
      >
        <TbPlus />
      </Button>
    </div>
  )
}

export default NewTransactionItem
