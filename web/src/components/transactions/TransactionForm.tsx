import { InputGroup, InputLeftAddon, Input, Button, Box } from "@hope-ui/solid"
import { gql } from "@solid-primitives/graphql"
import { Component, createSignal, onCleanup, onMount, Show } from "solid-js"
import {
  AccountMailboxOptionsQuery,
  CategoryOptionsQuery,
  CreateTransactionMutationVariables,
  CurrencyOptionsQuery
} from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { namedIcons } from "../../utils/namedIcons"
import { formatDateForInput } from "../../utils/formatters"
import CategoryIndicator from "../CategoryIndicator"
import { Form } from "../forms/Form"
import FormInput from "../forms/FormInput"
import FormOptionButtons from "../forms/FormOptionButtons"
import FormSwitch from "../forms/FormSwitch"
import { repeat } from "lodash"

const categoriesQuery = gql`
  query CategoryOptions {
    categories {
      id
      name
      color
      icon
    }
  }
`

const accountMailboxesQuery = gql`
  query AccountMailboxOptions {
    accountMailboxes {
      id
      name
    }
  }
`

export const currenciesQuery = gql`
  query CurrencyOptions {
    currencies {
      id
      code
      symbol
      decimalDigits
    }
  }
`

interface TransactionFormValues {
  amountType: "expense" | "income"
  amount: string
  currencyId: string
  memo: string
  date: string
  accountMailboxId: string
  includeInReports: boolean
}

const TransactionForm: Component<{
  transaction?: any
  onSave: (input: CreateTransactionMutationVariables["input"], id?: string) => void
  loading: boolean
}> = (props) => {
  const [categories] = useQuery<CategoryOptionsQuery>(categoriesQuery)
  const [accountMailboxes] = useQuery<AccountMailboxOptionsQuery>(accountMailboxesQuery)
  const [currencies] = useQuery<CurrencyOptionsQuery>(currenciesQuery)
  const [selectedCurrency, setSelectedCurrency] = createSignal<
    CurrencyOptionsQuery["currencies"][number] | undefined
  >()

  const onSave = ({ amountType, amount, date, ...data }: TransactionFormValues) => {
    const baseAmount = parseFloat(amount)
    const integerAmount = Math.floor(baseAmount * 10 ** (selectedCurrency()?.decimalDigits || 0))

    const coercedData = {
      ...data,
      amount: amountType === "expense" ? -integerAmount : integerAmount,
      date: new Date(date).toISOString(),
      includeInReports: Boolean(data.includeInReports)
    }

    props.onSave(coercedData, props?.transaction?.id)
  }

  let form: HTMLFormElement | undefined

  onMount(() => {
    form?.addEventListener("click", (event) => {
      setTimeout(() => {
        const currencyId = new FormData(form).get("currencyId")

        setSelectedCurrency(currencies()?.currencies.find((currency) => currency.id === currencyId))
      })
    })
  })

  return (
    <Form ref={form} onSave={onSave}>
      <Show when={!props.transaction?.splitFromId}>
        <FormOptionButtons
          name="amountType"
          defaultValue={
            props.transaction?.amount && props.transaction.amount.decimalAmount > 0
              ? "income"
              : "expense"
          }
          options={[
            {
              value: "expense",
              content: "Expense",
              props: { flex: 1 },
              buttonProps: { width: "full" }
            },
            {
              value: "income",
              content: "Income",
              props: { flex: 1 },
              buttonProps: { width: "full" }
            }
          ]}
        />

        <FormOptionButtons
          label="Currency"
          name="currencyId"
          defaultValue={props.transaction?.currencyId}
          options={
            currencies()?.currencies?.map((currency) => ({
              value: currency.id,
              content: currency.code
            })) || []
          }
        />

        <FormInput
          label="Amount"
          name="amount"
          type="number"
          defaultValue={
            props.transaction?.amount.decimalAmount &&
            Math.abs(props.transaction.amount.decimalAmount)
          }
          render={(props) => (
            <InputGroup>
              <InputLeftAddon>{selectedCurrency()?.symbol}</InputLeftAddon>
              <Input
                {...props}
                step={
                  selectedCurrency()?.decimalDigits
                    ? `0.${repeat("0", selectedCurrency()!.decimalDigits - 1)}1`
                    : "1"
                }
              />
            </InputGroup>
          )}
        />
      </Show>

      <FormInput label="Memo" name="memo" defaultValue={props.transaction?.memo} />

      <Show when={!props.transaction?.splitFromId}>
        <FormInput
          label="Date"
          name="date"
          type="date"
          defaultValue={formatDateForInput(
            props.transaction?.date ? new Date(props.transaction?.date) : new Date()
          )}
        />
      </Show>

      <CategorySelect transaction={props.transaction} categories={categories()?.categories} />

      <Show when={!props.transaction?.splitFromId}>
        <FormOptionButtons
          label="Account"
          name="accountMailboxId"
          defaultValue={props.transaction?.accountMailboxId}
          options={
            accountMailboxes()?.accountMailboxes?.map((account) => ({
              value: account.id,
              content: account.name
            })) || []
          }
        />
      </Show>

      <FormSwitch
        label="Include in reports"
        name="includeInReports"
        defaultValue={
          props.transaction?.includeInReports != null ? props.transaction.includeInReports : true
        }
      />

      <Button type="submit" colorScheme="primary" width="$full" disabled={props.loading}>
        Save
      </Button>
    </Form>
  )
}

const CategorySelect: Component<{
  transaction?: any
  categories?: CategoryOptionsQuery["categories"]
}> = (props) => {
  const [showing, setShowing] = createSignal(true)

  let ref: HTMLDivElement | undefined

  onMount(() => {
    const onInput = (event: Event) => {
      if (!(event.target instanceof HTMLInputElement)) {
        return
      }

      if (event.target.name === "amountType") {
        setShowing(event.target.value !== "income")
      }
    }

    ref?.closest("form")?.addEventListener("input", onInput)

    onCleanup(() => ref?.closest("form")?.removeEventListener("input", onInput))
  })

  return (
    <Show when={showing}>
      <FormOptionButtons
        ref={ref}
        label="Category"
        name="categoryId"
        defaultValue={props.transaction?.categoryId}
        options={
          props.categories?.map((category) => ({
            value: category.id,
            content: (
              <Box display="flex" alignItems="center" gap="2">
                <CategoryIndicator
                  size="6"
                  icon={namedIcons[category.icon]}
                  color={category.color}
                />
                {category.name}
              </Box>
            )
          })) || []
        }
      />
    </Show>
  )
}

export default TransactionForm
