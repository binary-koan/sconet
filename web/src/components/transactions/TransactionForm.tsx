import { createForm } from "@felte/solid"
import { validator } from "@felte/validator-superstruct"
import { repeat } from "lodash"
import { Component, createSignal, onCleanup, onMount, Show } from "solid-js"
import {
  boolean,
  Describe,
  enums,
  min,
  nonempty,
  nullable,
  number,
  object,
  optional,
  string
} from "superstruct"
import {
  AccountMailboxOptionsQuery,
  CategoryOptionsQuery,
  CreateTransactionInput,
  CurrencyOptionsQuery,
  GetTransactionQuery,
  UpdateTransactionInput
} from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { formatDateForInput } from "../../utils/formatters"
import { gql } from "../../utils/gql"
import { namedIcons } from "../../utils/namedIcons"
import { usedAsDirective } from "../../utils/usedAsDirective"
import { Button } from "../base/Button"
import { InputAddon, InputGroup, InputGroupInput } from "../base/InputGroup"
import CategoryIndicator from "../CategoryIndicator"
import FormInput from "../forms/FormInput"
import FormOptionButtons from "../forms/FormOptionButtons"
import FormSwitch from "../forms/FormSwitch"

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

type TransactionFormValues = CreateTransactionInput & { amountType: "expense" | "income" }

const transactionFormStruct: Describe<TransactionFormValues> = object({
  accountMailboxId: nonempty(string()),
  amount: min(number(), 0),
  categoryId: optional(nullable(nonempty(string()))),
  currencyId: nonempty(string()),
  date: optional(nullable(string())),
  includeInReports: optional(nullable(boolean())),
  memo: nonempty(string()),
  amountType: enums(["expense", "income"])
})

const TransactionForm: Component<{
  data?: GetTransactionQuery
  onSave: (input: CreateTransactionInput) => void | ((input: UpdateTransactionInput) => void)
  loading: boolean
}> = (props) => {
  const [categories] = useQuery<CategoryOptionsQuery>(categoriesQuery)
  const [accountMailboxes] = useQuery<AccountMailboxOptionsQuery>(accountMailboxesQuery)
  const [currencies] = useQuery<CurrencyOptionsQuery>(currenciesQuery)

  const { form, data } = createForm<TransactionFormValues>({
    onSubmit: ({ amountType, amount, date, ...data }) => {
      const integerAmount = Math.floor(amount * 10 ** (selectedCurrency()?.decimalDigits || 0))

      const coercedData = {
        ...data,
        amount: amountType === "expense" ? -integerAmount : integerAmount,
        date: new Date(date).toISOString(),
        includeInReports: Boolean(data.includeInReports)
      }

      props.onSave(coercedData)
    },

    extend: validator({ struct: transactionFormStruct })
  })

  const selectedCurrency = () =>
    currencies()?.currencies.find((currency) => currency.id === data("currencyId"))

  usedAsDirective(form)

  return (
    <form use:form>
      <Show when={!props.data?.transaction?.splitFromId}>
        <FormOptionButtons
          name="amountType"
          defaultValue={
            props.data?.transaction?.amount && props.data?.transaction.amount.decimalAmount > 0
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
          defaultValue={props.data?.transaction?.currencyId}
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
            props.data?.transaction?.amount.decimalAmount &&
            Math.abs(props.data?.transaction.amount.decimalAmount)
          }
          render={(props) => (
            <InputGroup>
              <InputAddon>{selectedCurrency()?.symbol}</InputAddon>
              <InputGroupInput
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

      <FormInput label="Memo" name="memo" defaultValue={props.data?.transaction?.memo} />

      <Show when={!props.data?.transaction?.splitFromId}>
        <FormInput
          label="Date"
          name="date"
          type="date"
          defaultValue={formatDateForInput(
            props.data?.transaction?.date ? new Date(props.data?.transaction?.date) : new Date()
          )}
        />
      </Show>

      <CategorySelect transaction={props.data?.transaction} categories={categories()?.categories} />

      <Show when={!props.data?.transaction?.splitFromId}>
        <FormOptionButtons
          label="Account"
          name="accountMailboxId"
          defaultValue={props.data?.transaction?.accountMailbox?.id}
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
          props.data?.transaction?.includeInReports != null
            ? props.data?.transaction.includeInReports
            : true
        }
      />

      <Button type="submit" colorScheme="primary" class="w-full" disabled={props.loading}>
        Save
      </Button>
    </form>
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
              <div class="flex items-center gap-2">
                <CategoryIndicator
                  class="h-6 w-6"
                  icon={namedIcons[category.icon]}
                  color={category.color}
                />
                {category.name}
              </div>
            )
          })) || []
        }
      />
    </Show>
  )
}

export default TransactionForm
