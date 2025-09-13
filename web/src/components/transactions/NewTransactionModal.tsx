import {
  createForm,
  Field,
  Form,
  getValue,
  minRange,
  setValue,
  SubmitEvent
} from "@modular-forms/solid"
import { countBy, repeat, uniq } from "lodash"
import {
  IconArrowsSplit2,
  IconCalendarEvent,
  IconPlus,
  IconSelector,
  IconSwitch3
} from "@tabler/icons-solidjs"
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  Show
} from "solid-js"
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
import { toCents } from "./AmountEditor"
import { Portal } from "solid-js/web"

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
  const categories = useCategoriesQuery(() => ({ archived: false, today: stripTime(new Date()) }))
  const currencies = useCurrenciesQuery()
  const currentUser = useCurrentUserQuery()
  const transactions = useTransactionsForPopulationQuery()

  const [splittingTransaction, setSplittingTransaction] =
    createSignal<FullTransactionFragment | null>(null)

  const recentShopsId = createUniqueId()

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

  let shopInput: HTMLInputElement | undefined

  const [shopFocused, setShopFocused] = createSignal(false)

  const normalizeShop = (string: string) => string.toLowerCase().replace(/[^\w]+/, "")

  const populateFromShop = (shopString: string) => {
    const recent =
      transactions()?.transactions.nodes.filter(
        (transaction) => normalizeShop(transaction.shop) === normalizeShop(shopString)
      ) || []
    const copyFrom = recent.at(-1)

    if (copyFrom) {
      setValue(form, "categoryId", copyFrom.category?.id)
      setValue(form, "accountId", copyFrom.account.id)
      setValue(form, "currencyId", copyFrom.account.currency.id)

      if (!getValue(form, "memo") && recent.every(({ memo }) => memo === copyFrom.memo)) {
        setValue(form, "memo", copyFrom.memo)
      }
    }
  }

  const topShops = createMemo(() => {
    const nodes = transactions()?.transactions.nodes || []
    const counts = countBy(nodes, "shop")
    return Array.from(Object.entries(counts))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name]) => name)
  })

  createEffect(() => {
    if (isDateSelected()) {
      shopInput?.focus()
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
    const integerAmount = toCents(amount || "0", currency)

    const coercedData: TransactionInput = {
      ...data,
      memo: data.memo || "",
      amountCents: shopCurrencyId
        ? null
        : amountType === "expense"
        ? -integerAmount
        : integerAmount,
      date: stripTime(new Date(date))
    }

    if (shopCurrencyId && shopAmount) {
      const shopCurrency = currencies()?.currencies.find(
        (currency) => currency.code === shopCurrencyId
      )
      const integerShopAmount = toCents(shopAmount || "0", shopCurrency)
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
        <Modal isOpen={props.isOpen}>
          <ModalContent class="h-124 relative flex flex-col">
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
                    ref={shopInput}
                    label="Where?"
                    name="shop"
                    list={recentShopsId}
                    onFocus={() => setShopFocused(true)}
                    onBlur={(e) => {
                      populateFromShop(e.target.value)
                      setTimeout(() => setShopFocused(false), 120)
                    }}
                  />
                  <datalist id={recentShopsId}>
                    <For
                      each={uniq(
                        transactions()?.transactions.nodes?.map(
                          (transaction) => transaction.shop
                        ) ?? []
                      )}
                    >
                      {(shop) => <option value={shop} />}
                    </For>
                  </datalist>

                  <FormInput placeholderLabel={true} of={form} label="What?" name="memo" />

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
                        class="rounded-sm border border-gray-100 px-4 py-2 text-xs text-gray-700"
                        onClick={() =>
                          setValue(
                            form,
                            "amountType",
                            field.value === "income" ? "expense" : "income"
                          )
                        }
                      >
                        {field.value === "income" ? "Income" : "Expense"}
                        <IconSwitch3 class="ml-1" />
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
                            class="w-full rounded-sm border border-gray-100 px-4 py-2 text-xs text-gray-700"
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
                            <IconSelector class="ml-1" />
                          </Button>
                        </Dropdown>
                      )}
                    </Field>
                  </Show>

                  <Button
                    size="custom"
                    variant="ghost"
                    class="whitespace-nowrap rounded-sm border border-gray-100 px-4 py-2 text-xs text-gray-700"
                    onClick={() => setValue(form, "date", "")}
                  >
                    <IconCalendarEvent class="mr-1" />
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
                            class="rounded-sm border border-gray-100 px-4 py-2 text-xs text-gray-700"
                            data-testid="account-select"
                          >
                            {account?.name} ({account?.currency.code})
                            <IconSelector class="ml-1" />
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
                            class="gap-1 rounded-sm border border-gray-100 px-4 py-2 text-xs text-gray-700"
                            data-testid="account-select"
                          >
                            {currency ? `Originally ${currency.code}` : "Original currency"}
                            {currency ? <IconSelector /> : <IconPlus />}
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
                  loading={createTransaction.loading}
                >
                  Save
                </Button>
                <Button
                  type="submit"
                  colorScheme="neutral"
                  variant="ghost"
                  class="-mt-2"
                  loading={createTransaction.loading}
                  data-action="split"
                >
                  <IconArrowsSplit2 class="mr-2" /> Save & split
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
        <Show when={shopFocused()}>
          <Portal>
            <div class="z-modal fixed inset-x-0 bottom-0 hidden bg-white/60 shadow-sm sm:block lg:bottom-2 lg:left-1/2 lg:max-w-lg lg:-translate-x-1/2 lg:rounded-sm">
              <div class="mx-auto max-w-lg p-2">
                <div class="flex flex-wrap gap-2">
                  <For each={topShops()}>
                    {(shop) => (
                      <Button
                        size="custom"
                        variant="ghost"
                        class="bg-white px-3 py-2 text-xs"
                        onClick={() => {
                          setValue(form, "shop", shop)
                          populateFromShop(shop)
                          setShopFocused(false)
                          shopInput?.blur()
                        }}
                      >
                        {shop}
                      </Button>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </Portal>
        </Show>
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
