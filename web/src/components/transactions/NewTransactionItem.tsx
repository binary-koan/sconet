import { Box, Input, IconButton, Icon } from "@hope-ui/solid"
import { TbPlus } from "solid-icons/tb"
import { Component, createSignal } from "solid-js"
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
    <Box
      display="flex"
      alignItems="center"
      paddingStart="$4"
      paddingEnd="$4"
      paddingTop="$2"
      paddingBottom="$2"
      backgroundColor="$neutral1"
      boxShadow="xs"
    >
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
        marginLeft="$2"
        flex="3"
        minWidth="0"
        paddingStart="$2"
        paddingEnd="$2"
        value={memo()}
        onChange={(e) => setMemo(e.currentTarget.value)}
      />

      <AmountInput
        containerProps={{
          marginLeft: "2",
          flex: "2",
          minWidth: "0"
        }}
        onLeftAddonClick={() => setIncome((isIncome) => !isIncome)}
        prefix={isIncome() ? "+" : "-"}
        paddingStart="$2"
        paddingEnd="$2"
        value={amount()}
        onChange={(e) => setAmount(e.currentTarget.value)}
      />

      <IconButton
        size="md"
        marginLeft="$2"
        colorScheme="primary"
        icon={<Icon as={TbPlus} />}
        aria-label="Confirm"
        onClick={() => {}}
      />
    </Box>
  )
}

export default NewTransactionItem
