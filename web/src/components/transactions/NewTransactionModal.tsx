import {
  createForm,
  Field,
  Form,
  getValue,
  minRange,
  setValue,
  SubmitEvent
} from "@modular-forms/solid"
import { repeat } from "lodash"
import { TbArrowsSplit2, TbCalendarEvent, TbPlus, TbSelector, TbSwitch3 } from "solid-icons/tb"
import { Component, createEffect, createSignal, For, Show } from "solid-js"
import toast from "solid-toast"
import { CreateTransactionInput, FullTransactionFragment } from "../../graphql-types"
import { useCreateTransaction } from "../../graphql/mutations/createTransactionMutation"
import { useCategoriesQuery } from "../../graphql/queries/categoriesQuery"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery"
import { useCurrentUserQuery } from "../../graphql/queries/currentUserQuery"
import { useTransactionsForPopulationQuery } from "../../graphql/queries/transactionsForPopulation"
import { CATEGORY_BACKGROUND_COLORS, CategoryColor } from "../../utils/categoryColors"
import { stripTime } from "../../utils/date"
import { AccountSelect } from "../accounts/AccountSelect"
import { Button } from "../base/Button"
import { InputAddon } from "../base/InputGroup"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal"
import { CurrencySelect } from "../currencies/CurrencySelect"
import { Dropdown, DropdownMenuItem } from "../Dropdown"
import { FormDatePicker } from "../forms/FormDatePicker"
import FormInput from "../forms/FormInput"
import FormInputGroup from "../forms/FormInputGroup"
import { SplitTransactionModal } from "./SplitTransactionModal"

type NewTransactionModalValues = Omit<CreateTransactionInput, "amount" | "originalAmount"> & {
  amountType: "expense" | "income"
  amount?: string
  originalAmount?: string
}

export const NewTransactionModal: Component<{
  initialDate?: Date
  isOpen: boolean
  onClose: () => void
}> = (props) => {
  const categories = useCategoriesQuery()
  const currencies = useCurrenciesQuery()
  const currentUser = useCurrentUserQuery()
  const transactions = useTransactionsForPopulationQuery()

  const [splittingTransaction, setSplittingTransaction] =
    createSignal<FullTransactionFragment | null>(null)

  const createTransaction = useCreateTransaction({
    onSuccess: () => {
      toast.success("Transaction created")
    }
  })

  const [form] = createForm<NewTransactionModalValues>({
    initialValues: {
      date: props.initialDate && stripTime(props.initialDate),
      amountType: "expense"
    }
  })

  let memoInput: HTMLInputElement | undefined

  createEffect(() => {
    if (isDateSelected()) {
      memoInput?.focus()
    }
  })

  createEffect(() => {
    if (currentUser()?.currentUser?.defaultAccount && !getValue(form, "accountId")) {
      setValue(form, "accountId", currentUser()!.currentUser!.defaultAccount!.id)
      setValue(form, "currencyCode", currentUser()!.currentUser!.defaultAccount!.currencyCode)
    }
  })

  const onSave = async (
    {
      amount,
      amountType,
      date,
      originalAmount,
      originalCurrencyCode,
      ...data
    }: NewTransactionModalValues,
    event: SubmitEvent
  ) => {
    const currency = currencies()?.currencies.find(
      (currency) => currency.code === data.currencyCode
    )
    const integerAmount = Math.round(
      parseFloat(amount || "0") * 10 ** (currency?.decimalDigits || 0)
    )

    const coercedData: CreateTransactionInput = {
      ...data,
      amount: originalCurrencyCode
        ? null
        : amountType === "expense"
        ? -integerAmount
        : integerAmount,
      date: stripTime(new Date(date)),
      includeInReports: Boolean(data.includeInReports)
    }

    if (originalCurrencyCode && originalAmount) {
      const originalCurrency = currencies()?.currencies.find(
        (currency) => currency.code === originalCurrencyCode
      )
      const integerOriginalAmount = Math.round(
        parseFloat(originalAmount || "0") * 10 ** (originalCurrency?.decimalDigits || 0)
      )
      coercedData.originalAmount =
        amountType === "expense" ? -integerOriginalAmount : integerOriginalAmount
      coercedData.originalCurrencyCode = originalCurrencyCode
    }

    const result = await createTransaction({ input: coercedData })

    if (result && event.submitter.dataset.action === "split") {
      setSplittingTransaction(result.createTransaction)
    } else {
      props.onClose()
    }
  }

  const isDateSelected = () => {
    return getValue(form, "date")
  }

  const selectedCurrency = () =>
    currencies()?.currencies.find((currency) => currency.code === getValue(form, "currencyCode"))

  const selectedOriginalCurrency = () =>
    currencies()?.currencies.find(
      (currency) => currency.code === getValue(form, "originalCurrencyCode")
    )

  const selectedCategory = () =>
    categories()?.categories.find((category) => category.id === getValue(form, "categoryId"))

  const todayISO = () => {
    const now = new Date()
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now
      .getDate()
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <>
      <Show when={!splittingTransaction()}>
        <Modal isOpen={props.isOpen} onClickOutside={props.onClose}>
          <ModalContent class="flex h-[28rem] flex-col">
            <ModalTitle>
              New Transaction
              <ModalCloseButton onClick={props.onClose} />
            </ModalTitle>

            <Form of={form} onSubmit={onSave} class="flex flex-1 flex-col justify-center">
              <FormDatePicker
                of={form}
                label="Date"
                labelHidden={true}
                name="date"
                maxDate={todayISO()}
                class={isDateSelected() ? "hidden" : ""}
              />

              <div classList={{ hidden: !isDateSelected() }} class="flex flex-1 flex-col gap-4">
                <div class="my-auto flex flex-col gap-2">
                  <FormInput
                    placeholderLabel={true}
                    of={form}
                    ref={memoInput}
                    label="Memo"
                    name="memo"
                    onBlur={(e) => {
                      const recent = transactions()?.transactions.data.find(
                        (transaction) =>
                          transaction.memo.toLowerCase().replace(/[^\w]+/, "") ===
                          e.target.value.toLowerCase().replace(/[^\w]+/, "")
                      )

                      if (recent) {
                        setValue(form, "categoryId", recent.categoryId)
                        setValue(form, "accountId", recent.accountId)
                      }
                    }}
                  />

                  <Show
                    when={getValue(form, "originalCurrencyCode")}
                    fallback={
                      <FormInputGroup
                        of={form}
                        label="Amount"
                        name="amount"
                        inputmode="decimal"
                        placeholderLabel={true}
                        validate={minRange(0, "Must be zero or more")}
                        before={<InputAddon>{selectedCurrency()?.symbol}</InputAddon>}
                        step={
                          selectedCurrency()?.decimalDigits
                            ? `0.${repeat("0", selectedCurrency()!.decimalDigits - 1)}1`
                            : "1"
                        }
                      />
                    }
                  >
                    <FormInputGroup
                      of={form}
                      label="Original amount"
                      name="originalAmount"
                      inputmode="decimal"
                      placeholderLabel={true}
                      validate={minRange(0, "Must be zero or more")}
                      before={<InputAddon>{selectedOriginalCurrency()?.symbol}</InputAddon>}
                      step={
                        selectedOriginalCurrency()?.decimalDigits
                          ? `0.${repeat("0", selectedOriginalCurrency()!.decimalDigits - 1)}1`
                          : "1"
                      }
                    />
                  </Show>
                </div>

                <Field of={form} name="currencyCode">
                  {(field) => <input type="hidden" value={field.value} />}
                </Field>

                <div class="flex gap-4">
                  <Field of={form} name="amountType">
                    {(field) => (
                      <Button
                        size="custom"
                        variant="ghost"
                        class="rounded border border-gray-100 px-4 py-2 text-xs text-gray-700"
                        onClick={() =>
                          setValue(
                            form,
                            "amountType",
                            field.value === "income" ? "expense" : "income"
                          )
                        }
                      >
                        {field.value === "income" ? "Income" : "Expense"}
                        <TbSwitch3 class="ml-1" />
                      </Button>
                    )}
                  </Field>

                  <Show when={getValue(form, "amountType") !== "income"}>
                    <Field of={form} name="categoryId">
                      {() => (
                        <Dropdown
                          closeOnItemClick
                          class="min-w-0"
                          content={
                            <For each={categories()?.categories}>
                              {(category) => (
                                <DropdownMenuItem
                                  class="text-sm"
                                  data-testid="category-item"
                                  onClick={() => setValue(form, "categoryId", category.id)}
                                >
                                  <div
                                    class={`h-2 w-2 rounded-full ${
                                      CATEGORY_BACKGROUND_COLORS[category.color as CategoryColor]
                                    }`}
                                  />
                                  {category.name}
                                </DropdownMenuItem>
                              )}
                            </For>
                          }
                        >
                          <Button
                            size="custom"
                            variant="ghost"
                            class="w-full rounded border border-gray-100 px-4 py-2 text-xs text-gray-700"
                            data-testid="category-select"
                          >
                            <Show when={selectedCategory()}>
                              <div
                                class={`mr-2 h-2 w-2 rounded-full ${
                                  CATEGORY_BACKGROUND_COLORS[
                                    selectedCategory()!.color as CategoryColor
                                  ]
                                }`}
                              />
                            </Show>
                            <span class="min-w-0 truncate">
                              {selectedCategory()?.name || "No category"}
                            </span>
                            <TbSelector class="ml-1" />
                          </Button>
                        </Dropdown>
                      )}
                    </Field>
                  </Show>

                  <Button
                    size="custom"
                    variant="ghost"
                    class="whitespace-nowrap rounded border border-gray-100 px-4 py-2 text-xs text-gray-700"
                    onClick={() => setValue(form, "date", "")}
                  >
                    <TbCalendarEvent class="mr-1" />
                    {getValue(form, "date")}
                  </Button>
                </div>

                <div class="mb-2 flex gap-4">
                  <Field of={form} name="accountId">
                    {(field) => (
                      <AccountSelect
                        value={field.value}
                        onChange={(account) => {
                          setValue(form, "accountId", account.id)
                          setValue(form, "currencyCode", account.currencyCode)
                        }}
                      >
                        {(account) => (
                          <Button
                            size="custom"
                            variant="ghost"
                            class="rounded border border-gray-100 px-4 py-2 text-xs text-gray-700"
                            data-testid="account-select"
                          >
                            {account?.name} ({account?.currencyCode})
                            <TbSelector class="ml-1" />
                          </Button>
                        )}
                      </AccountSelect>
                    )}
                  </Field>

                  <Field of={form} name="originalCurrencyCode">
                    {(field) => (
                      <CurrencySelect
                        value={field.value}
                        onChange={(currencyCode) =>
                          setValue(form, "originalCurrencyCode", currencyCode)
                        }
                        filter={(currency) => currency.code !== selectedCurrency()?.code}
                      >
                        {(currency) => (
                          <Button
                            size="custom"
                            variant="ghost"
                            class="gap-1 rounded border border-gray-100 px-4 py-2 text-xs text-gray-700"
                            data-testid="account-select"
                          >
                            {currency ? `Originally ${currency.code}` : "Original currency"}
                            {currency ? <TbSelector /> : <TbPlus />}
                          </Button>
                        )}
                      </CurrencySelect>
                    )}
                  </Field>
                </div>

                <Button
                  type="submit"
                  colorScheme="primary"
                  class="mt-auto w-full"
                  disabled={createTransaction.loading}
                >
                  Save
                </Button>
                <Button
                  type="submit"
                  colorScheme="neutral"
                  variant="ghost"
                  class="-mt-2"
                  disabled={createTransaction.loading}
                  data-action="split"
                >
                  <TbArrowsSplit2 class="mr-2" /> Save & split
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
      </Show>
      <Show when={splittingTransaction()}>
        {(splittingTransaction) => (
          <SplitTransactionModal
            isOpen={true}
            onClose={props.onClose}
            onFinish={props.onClose}
            transaction={splittingTransaction()}
          />
        )}
      </Show>
    </>
  )
}
