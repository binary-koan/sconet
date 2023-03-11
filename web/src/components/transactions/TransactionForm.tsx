import { createForm, Form, getValue, minNumber, required } from "@modular-forms/solid"
import { repeat } from "lodash"
import { Component, Show } from "solid-js"
import {
  CreateTransactionInput,
  GetTransactionQuery,
  UpdateTransactionInput
} from "../../graphql-types"
import { useAccountMailboxesQuery } from "../../graphql/queries/accountMailboxesQuery"
import { useCategoriesQuery } from "../../graphql/queries/categoriesQuery"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery"
import { formatDateForInput } from "../../utils/formatters"
import { namedIcons } from "../../utils/namedIcons"
import { Button } from "../base/Button"
import { InputAddon } from "../base/InputGroup"
import CategoryIndicator from "../CategoryIndicator"
import FormInput from "../forms/FormInput"
import FormInputGroup from "../forms/FormInputGroup"
import FormOptionButtons from "../forms/FormOptionButtons"
import FormSwitch from "../forms/FormSwitch"

type TransactionFormValues = CreateTransactionInput & { amountType: "expense" | "income" }

const TransactionForm: Component<{
  data?: GetTransactionQuery
  onSave: (input: UpdateTransactionInput) => void
  loading: boolean
}> = (props) => {
  const categories = useCategoriesQuery()
  const accountMailboxes = useAccountMailboxesQuery()
  const currencies = useCurrenciesQuery()

  const form = createForm<TransactionFormValues>({
    initialValues: {
      amountType:
        props.data?.transaction?.amount && props.data?.transaction.amount.decimalAmount > 0
          ? "income"
          : "expense",

      currencyId: props.data?.transaction?.currencyId,

      amount:
        props.data?.transaction?.amount.decimalAmount &&
        Math.abs(props.data?.transaction.amount.decimalAmount),

      memo: props.data?.transaction?.memo,

      date: formatDateForInput(
        props.data?.transaction?.date ? new Date(props.data?.transaction?.date) : new Date()
      ),

      accountMailboxId: props.data?.transaction?.accountMailbox?.id,

      includeInReports:
        props.data?.transaction?.includeInReports != null
          ? props.data?.transaction.includeInReports
          : true,

      categoryId: props.data?.transaction?.category?.id
    }
  })

  const onSubmit = ({ amountType, amount, date, ...data }: TransactionFormValues) => {
    const integerAmount = Math.floor(amount * 10 ** (selectedCurrency()?.decimalDigits || 0))

    const coercedData: UpdateTransactionInput = { ...data }

    if (amountType) {
      coercedData.amount = amountType === "expense" ? -integerAmount : integerAmount
    }
    if (date) {
      coercedData.date = new Date(date).toISOString().split("T")[0]
    }
    coercedData.includeInReports = Boolean(data.includeInReports)

    props.onSave(coercedData)
  }

  const selectedCurrency = () =>
    currencies()?.currencies.find((currency) => currency.id === getValue(form, "currencyId"))

  const isIncome = () => getValue(form, "amountType") === "income"

  return (
    <Form of={form} onSubmit={onSubmit}>
      <FormInput of={form} label="Memo" name="memo" validate={required("Cannot be blank")} />

      <Show when={!props.data?.transaction?.splitFromId}>
        <FormOptionButtons
          of={form}
          label="Type"
          name="amountType"
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
          of={form}
          label="Currency"
          name="currencyId"
          validate={required("Cannot be blank")}
          options={
            currencies()?.currencies?.map((currency) => ({
              value: currency.id,
              content: currency.code
            })) || []
          }
        />

        <FormInputGroup
          of={form}
          label="Amount"
          name="amount"
          type="number"
          validate={minNumber(0, "Must be zero or more")}
          before={<InputAddon>{selectedCurrency()?.symbol}</InputAddon>}
          step={
            selectedCurrency()?.decimalDigits
              ? `0.${repeat("0", selectedCurrency()!.decimalDigits - 1)}1`
              : "1"
          }
        />
      </Show>

      <Show when={!props.data?.transaction?.splitFromId}>
        <FormInput
          of={form}
          label="Date"
          name="date"
          type="date"
          validate={required("Cannot be blank")}
        />
      </Show>

      <Show when={!isIncome()}>
        <FormOptionButtons
          of={form}
          label="Category"
          name="categoryId"
          options={
            categories()?.categories.map((category) => ({
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

      <Show when={!props.data?.transaction?.splitFromId}>
        <FormOptionButtons
          of={form}
          label="Account"
          name="accountMailboxId"
          validate={required("Cannot be blank")}
          options={
            accountMailboxes()?.accountMailboxes?.map((account) => ({
              value: account.id,
              content: account.name
            })) || []
          }
        />
      </Show>

      <FormSwitch of={form} label="Include in reports" name="includeInReports" />

      <Button type="submit" colorScheme="primary" class="w-full" disabled={props.loading}>
        Save
      </Button>
    </Form>
  )
}

export default TransactionForm
