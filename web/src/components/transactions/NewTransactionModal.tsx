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
import { TransactionInput, FullTransactionFragment } from "../../graphql-types"
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

type NewTransactionModalValues = Omit<TransactionInput, "amount" | "shopAmount"> & {
  amountType: "expense" | "income"
  amount?: string
  shopAmount?: string
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
      setValue(form, "currencyId", currentUser()!.currentUser!.defaultAccount!.currency.id)
    }
  })

  const onSave = async (
    { amount, amountType, date, shopAmount, shopCurrencyId, ...data }: NewTransactionModalValues,
    event: SubmitEvent
  ) => {
    const currency = currencies()?.currencies.find((currency) => currency.id === data.currencyId)
    const integerAmount = Math.round(
      parseFloat(amount || "0") * 10 ** (currency?.decimalDigits || 0)
    )

    const coercedData: TransactionInput = {
      ...data,
      amountCents: shopCurrencyId
        ? null
        : amountType === "expense"
        ? -integerAmount
        : integerAmount,
      date: stripTime(new Date(date)),
      includeInReports: Boolean(data.includeInReports)
    }

    if (shopCurrencyId && shopAmount) {
      const shopCurrency = currencies()?.currencies.find(
        (currency) => currency.code === shopCurrencyId
      )
      const integerShopAmount = Math.round(
        parseFloat(shopAmount || "0") * 10 ** (shopCurrency?.decimalDigits || 0)
      )
      coercedData.shopAmountCents =
        amountType === "expense" ? -integerShopAmount : integerShopAmount
      coercedData.shopCurrencyId = shopCurrencyId
    }

    const result = await createTransaction({ input: coercedData })

    if (result && event.submitter.dataset.action === "split") {
      setSplittingTransaction(result.transactionCreate.transaction)
    } else {
      props.onClose()
    }
  }

  const isDateSelected = () => {
    return getValue(form, "date")
  }

  const selectedCurrency = () =>
    currencies()?.currencies.find((currency) => currency.id === getValue(form, "currencyId"))

  const selectedShopCurrency = () =>
    currencies()?.currencies.find((currency) => currency.id === getValue(form, "shopCurrencyId"))

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
                      const recent = transactions()?.transactions.nodes.find(
                        (transaction) =>
                          transaction.memo.toLowerCase().replace(/[^\w]+/, "") ===
                          e.target.value.toLowerCase().replace(/[^\w]+/, "")
                      )

                      if (recent) {
                        setValue(form, "categoryId", recent.category?.id)
                        setValue(form, "accountId", recent.account.id)
                        setValue(form, "currencyId", recent.account.currency.id)
                      }
                    }}
                  />

                  <Show
                    when={getValue(form, "shopCurrencyId")}
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
                      name="shopAmount"
                      inputmode="decimal"
                      placeholderLabel={true}
                      validate={minRange(0, "Must be zero or more")}
                      before={<InputAddon>{selectedShopCurrency()?.symbol}</InputAddon>}
                      step={
                        selectedShopCurrency()?.decimalDigits
                          ? `0.${repeat("0", selectedShopCurrency()!.decimalDigits - 1)}1`
                          : "1"
                      }
                    />
                  </Show>
                </div>

                <Field of={form} name="currencyId">
                  {(field) => <input type="hidden" value={field.value || undefined} />}
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
                        value={field.value || null}
                        onChange={(account) => {
                          setValue(form, "accountId", account.id)
                          setValue(form, "currencyId", account.currency.id)
                        }}
                      >
                        {(account) => (
                          <Button
                            size="custom"
                            variant="ghost"
                            class="rounded border border-gray-100 px-4 py-2 text-xs text-gray-700"
                            data-testid="account-select"
                          >
                            {account?.name} ({account?.currency.code})
                            <TbSelector class="ml-1" />
                          </Button>
                        )}
                      </AccountSelect>
                    )}
                  </Field>

                  <Field of={form} name="shopCurrencyId">
                    {(field) => (
                      <CurrencySelect
                        value={field.value || null}
                        onChange={(currencyId) => setValue(form, "shopCurrencyId", currencyId)}
                        filter={(currency) => currency.id !== selectedCurrency()?.id}
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
